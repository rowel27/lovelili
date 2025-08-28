import stripe
import json

from rest_framework import viewsets, filters
from rest_framework.views import APIView
from rest_framework import status
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Drop, Category, Product, Cart, CartItem
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .serializers import DropSerializer, CategorySerializer, ProductSerializer
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods
from rest_framework import generics
from rest_framework.decorators import api_view
from .webhook import stripe_webhook





# This is your test secret API key.
stripe.api_key = settings.STRIPE_SECRET_KEY
  # views.py
@csrf_exempt
@require_http_methods(["POST"])
def create_checkout_session(request):
    try:
        data = json.loads(request.body)
        cart_items = data.get("cart", [])

        if not cart_items:
            return JsonResponse({"error": "Cart is empty"}, status=400)

        line_items = []
        product_ids = []

        for item in cart_items:
            product_id = item.get("id")
            product = Product.objects.get(id=product_id)

            if product.is_sold or product.is_reserved:
                return JsonResponse({"error": f"{product.name} is unavailable"}, status=400)

            if not product.stripe_price_id:
                return JsonResponse({"error": f"{product.name} is missing a Stripe Price ID"}, status=400)

            product.is_reserved = True
            product.save()
            product_ids.append(str(product.id))

            # Use price from database
            line_items.append({
                "price": product.stripe_price_id,
                "quantity": 1,
            })

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            shipping_address_collection={},
            shipping_options=[
                {
                    "shipping_rate_data": {
                        "display_name": "US Shipping",
                        "type": "fixed_amount",
                        "fixed_amount": {"amount": 500, "currency": "usd"},
                    }
                },
                {
                    "shipping_rate_data": {
                        "display_name": "International Shipping",
                        "type": "fixed_amount",
                        "fixed_amount": {"amount": 1500, "currency": "usd"},
                    }
                }
            ],
            metadata={"product_ids": ",".join(product_ids)},
            automatic_tax={"enabled": True}, 
            success_url="https://lovelili-1.onrender.com/success",
            cancel_url="https://lovelili-1.onrender.com/cancel",
        )

        return JsonResponse({"url": session.url})

    except Product.DoesNotExist:
        return JsonResponse({"error": "Invalid product ID"}, status=400)
    except Exception as e:
        print("Checkout error:", e)
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt
@require_http_methods(["POST"])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except stripe.error.SignatureVerificationError:
        return JsonResponse({"error": "Invalid signature"}, status=400)

    # Payment successful
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        product_ids = session["metadata"]["product_ids"].split(",")

        # Retrieve line items from Stripe
        line_items = stripe.checkout.Session.list_line_items(session["id"])
        price_ids = [item.price.id for item in line_items.data]

        # Map Stripe Price IDs back to products
        for product_id, price_id in zip(product_ids, price_ids):
            try:
                product = Product.objects.get(id=product_id)
                product.is_reserved = False
                product.is_sold = True
                product.save()
            except Product.DoesNotExist:
                continue

    # Payment abandoned or expired
    elif event["type"] == "checkout.session.expired":
        session = event["data"]["object"]
        product_ids = session["metadata"]["product_ids"].split(",")
        for pid in product_ids:
            try:
                product = Product.objects.get(id=pid)
                product.is_reserved = False
                product.save()
            except Product.DoesNotExist:
                continue

    return JsonResponse({"status": "success"})



@api_view(['GET'])
def current_drop(request):
    """Get the current live drop"""
    current_drop = Drop.objects.filter(is_live=True).first()
    if current_drop:
        serializer = DropSerializer(current_drop)
        return Response(serializer.data)
    return Response({'message': 'No current drop available'})

    
def get_or_create_cart(request):
    """Get cart for logged-in user or session-based cart for anonymous users"""
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user)
    else:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        cart, created = Cart.objects.get_or_create(session_key=session_key)
    return cart

@csrf_exempt
@require_http_methods(["POST"])
def add_to_cart(request):
    data = json.loads(request.body)
    product_id = data.get('product_id')
    quantity = int(data.get('quantity', 1))
    
    product = get_object_or_404(Product, id=product_id)

    if product.is_sold:
        return JsonResponse({'error': 'Product already sold'}, status=400)
    cart = get_or_create_cart(request)
    
    cart_item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product,
        defaults={'quantity': quantity}
    )
    
    if not created:
        cart_item.quantity += quantity
        cart_item.save()
    
    return JsonResponse({
        'success': True,
        'cart_total_items': cart.get_total_items(),
        'cart_total_price': str(cart.get_total_price())
    })

@require_http_methods(["GET"])
def get_cart(request):
    cart = get_or_create_cart(request)
    cart_items = []
    
    for item in cart.items.all():
        cart_items.append({
            'id': item.id,
            'product_id': item.product.id,
            'product_name': item.product.name,
            'product_price': str(item.product.price),
            'quantity': item.quantity,
            'total_price': str(item.get_total_price())
        })
    
    return JsonResponse({
        'items': cart_items,
        'total_items': cart.get_total_items(),
        'total_price': str(cart.get_total_price())
    })

@csrf_exempt
@require_http_methods(["DELETE"])
def remove_from_cart(request, item_id):
    cart = get_or_create_cart(request)
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
    cart_item.delete()
    
    return JsonResponse({
        'success': True,
        'cart_total_items': cart.get_total_items(),
        'cart_total_price': str(cart.get_total_price())
    })

@api_view(['GET'])
def drops_list(request):
    """Return all live drops with their basic info"""
    drops = Drop.objects.filter(is_live=True).order_by('-drop_date')
    drops_data = []
    
    for drop in drops:
        drops_data.append({
            'id': drop.id,
            'name': drop.name,
            'description': drop.description,
            'drop_date': drop.drop_date,
            # You might want to add a featured image to your Drop model
            # 'image': drop.featured_image.url if drop.featured_image else None,
        })
    
    return Response(drops_data)

@csrf_exempt
@require_http_methods(["POST"])
def cancel_reservation(request):
    """
    Unreserve products in the cart when payment is canceled.
    Expects JSON: {"product_ids": [1, 2, 3]}
    """
    data = json.loads(request.body)
    product_ids = data.get("product_ids", [])

    if not product_ids:
        return JsonResponse({"error": "No product IDs provided"}, status=400)

    products = Product.objects.filter(id__in=product_ids)
    products.update(is_reserved=False)

    return JsonResponse({"success": True, "message": "Products unreserved"})

class DropViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Drop.objects.all()
    serializer_class = DropSerializer
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get the current live drop"""
        current_drop = Drop.objects.filter(is_live=True).first()
        if current_drop:
            serializer = self.get_serializer(current_drop)
            return Response(serializer.data)
        return Response({'message': 'No current drop available'})

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['price', 'is_sold', 'drop']
    ordering = ['drop']
    
    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category')
        drop = self.request.query_params.get('drop')
        
        if category:
            try:
                # Convert to int and check if category exists
                category_id = int(category)
                queryset = queryset.filter(category__id=category_id)
            except (ValueError, TypeError):
                # Invalid category ID, return empty queryset
                return Product.objects.none()
                
        if drop:
            try:
                # Convert to int and check if drop exists
                drop_id = int(drop)
                queryset = queryset.filter(drop__id=drop_id)
            except (ValueError, TypeError):
                # Invalid drop ID, return empty queryset
                return Product.objects.none()
                
        return queryset

#! /usr/bin/env python3.6
