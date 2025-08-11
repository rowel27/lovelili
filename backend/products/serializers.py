from rest_framework import serializers
from .models import Drop, Category, Product, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class DropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drop
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class ProductSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    stripe_price_id = serializers.CharField(required=False, allow_blank=True)
    category = CategorySerializer(read_only=True)
    drop = DropSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = Product
        fields = '__all__'
        
