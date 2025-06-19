from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Drop, Category, Product
from .serializers import DropSerializer, CategorySerializer, ProductSerializer

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