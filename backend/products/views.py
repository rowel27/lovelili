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
        for item in cart_items:
            product_id = item.get("id")
            product = Product.objects.get(id=product_id)

            # optional: check availability
            if product.is_sold or product.is_reserved:
                return JsonResponse({"error": f"{product.name} is unavailable"}, status=400)

            product.is_reserved = True
            product.save()

            line_items.append({
                "price_data": {
                    "currency": "usd",
                    "product_data": {"name": product.name},
                    "unit_amount": int(product.price * 100),
                },
                "quantity": 1,
            })

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            shipping_address_collection={"allowed_countries": ["US", "CA"]},
            success_url="http://localhost:3000/success",
            cancel_url="http://localhost:3000/cancel",
        )

        return JsonResponse({"url": session.url})

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

    # payment successful
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        product_ids = session["metadata"]["product_ids"].split(",")
        for pid in product_ids:
            product = Product.objects.get(id=pid)
            product.is_reserved = False
            product.is_sold = True
            product.save()

    # payment abandoned or expired
    elif event["type"] == "checkout.session.expired":
        session = event["data"]["object"]
        product_ids = session["metadata"]["product_ids"].split(",")
        for pid in product_ids:
            product = Product.objects.get(id=pid)
            product.is_reserved = False
            product.save()

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

class DropViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Drop.objects.all()
    serializer_class = DropSerializer
    
    @action(detail=False, methods=['get'])
    def current(self):
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
    queryset = Product.objects.all()  # Only show available products
    serializer_class = ProductSerializer
    filter_backends =[filters.OrderingFilter]
    ordering_fields = ['price', 'is_sold', 'drop']
    ordering = ['drop']
    
    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category')
        drop = self.request.query_params.get('drop')
        
        if category:
            queryset = queryset.filter(category__id=category)
        if drop:
            queryset = queryset.filter(drop__id=drop)
            
        return queryset
#! /usr/bin/env python3.6
