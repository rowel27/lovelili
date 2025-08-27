from rest_framework import serializers
from .models import Drop, Category, Product, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class DropSerializer(serializers.ModelSerializer):
    featured_image = serializers.ImageField(use_url=True, read_only=True)
    
    class Meta:
        model = Drop
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'position', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url
        return None

class ProductSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    stripe_price_id = serializers.CharField(required=False, allow_blank=True)
    category = CategorySerializer(read_only=True)
    drop = DropSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    image = serializers.ImageField(use_url=True)
    is_sold = serializers.BooleanField(default=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:  # ← Add request check
            return request.build_absolute_uri(obj.image.url)
        elif obj.image:
            return obj.image.url  # Fallback to relative URL
        return None
            
