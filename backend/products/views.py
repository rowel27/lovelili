import stripe

from rest_framework import viewsets
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
import json



# This is your test secret API key.
stripe.api_key = settings.STRIPE_SECRET_KEY

@method_decorator(csrf_exempt, name='dispatch')
class StripeCheckoutView(View):
    def post(self, request, product_id):
        product = get_object_or_404(Product, id=product_id)

        if product.is_sold:
            return JsonResponse({'error': 'Product already sold'}, status=400)

        if not product.stripe_price_id:
            return JsonResponse({'error': 'Stripe Price ID not set for this product'}, status=400)

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': product.stripe_price_id,
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:8000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:8000/cancel',
            metadata={'product_id': str(product.id)},
        )

        return JsonResponse({'id': session.id})


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
    
    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category')
        drop = self.request.query_params.get('drop')
        
        if category:
            queryset = queryset.filter(category__id=category)
        if drop:
            queryset = queryset.filter(drop__id=drop)
            
        return queryset
    
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
#! /usr/bin/env python3.6
