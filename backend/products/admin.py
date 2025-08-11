from django.contrib import admin
from .models import Drop, Category, Product, ProductImage

# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'id']
    search_fields = ['name']
    ordering = ['name']

@admin.register(Drop)
class DropAdmin(admin.ModelAdmin):
    list_display = ['name', 'drop_date', 'is_live', 'created_at']
    list_filter = ['is_live', 'drop_date', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['-drop_date']
    date_hierarchy = 'drop_date'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description')
        }),
        ('Drop Details', {
            'fields': ('drop_date', 'is_live')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at']

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'drop', 'price', 'is_sold', 'created_at']
    list_filter = ['category', 'drop', 'is_sold', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'price')
        }),
        ('Categorization', {
            'fields': ('category', 'drop')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Status', {
            'fields': ('is_sold',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at']
    inlines = [ProductImageInline]
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('category', 'drop')

# Customize admin site
admin.site.site_header = "LoveLili Admin"
admin.site.site_title = "LoveLili Admin Portal"
admin.site.index_title = "Welcome to LoveLili Administration"

admin.site.register(ProductImage)
    