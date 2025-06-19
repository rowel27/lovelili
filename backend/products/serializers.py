from rest_framework import serializers
from .models import Drop, Category, Product

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class DropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drop
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    drop = DropSerializer(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
        
