import stripe

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import status
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Drop, Category, Product
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .serializers import DropSerializer, CategorySerializer, ProductSerializer
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator



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
    queryset = Product.objects.filter(is_sold=False)  # Only show available products
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_sold=False)
        category = self.request.query_params.get('category')
        drop = self.request.query_params.get('drop')
        
        if category:
            queryset = queryset.filter(category__id=category)
        if drop:
            queryset = queryset.filter(drop__id=drop)
            
        return queryset
    
#! /usr/bin/env python3.6
