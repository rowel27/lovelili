from django.contrib import admin
from .models import Drop, Category, Product

# Register your models here.

@admin.register(Drop)
class DropAdmin(admin.ModelAdmin):
    list_display = ['name', 'drop_date', 'is_live', 'created_at']
    list_filter = ['is_live', 'drop_date']
    search_fields = ['name']
    list_editable = ['is_live']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'drop', 'price', 'is_sold', 'created_at']
    list_filter = ['category', 'drop', 'is_sold']
    search_fields = ['name', 'description']
    list_editable = ['is_sold']
    readonly_fields = ['created_at']
    