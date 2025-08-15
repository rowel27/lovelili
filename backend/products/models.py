from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from decimal import Decimal
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

# Create your models here.

class Drop(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    drop_date = models.DateTimeField()
    is_live = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    drop = models.ForeignKey(Drop, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')
    is_sold = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    stripe_price_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

    def clean(self):
        # Ensure product isn't already sold when trying to add to cart
        pass

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/')
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['position']
        
    def __str__(self):
        return f"{self.product.name} - {self.position}"


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.user:
            return f"Cart for {self.user.username}"
        return f"Anonymous cart {self.session_key}"

    def get_total_price(self):
        return sum(item.get_total_price() for item in self.items.all())

    def get_total_items(self):
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    def get_total_price(self):
        return self.quantity * self.product.price

    def clean(self):
        # Ensure the product isn't already sold
        if self.product.is_sold:
            raise ValidationError(f"Product '{self.product.name}' is no longer available.")
        
        # Since each product is unique, quantity should always be 1
        if self.quantity != 1:
            raise ValidationError("Each product is unique. Quantity must be 1.")

    def save(self, *args, **kwargs):
        self.quantity = 1  # Force quantity to 1 since each product is unique
        self.clean()
        super().save(*args, **kwargs)


class Order(models.Model):
    """Represents a completed purchase from cart"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='PurchasedProduct')
    stripe_checkout_session_id = models.CharField(max_length=255, unique=True)
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username} - ${self.total_amount}"

    class Meta:
        ordering = ['-created_at']

    @classmethod
    def create_from_cart(cls, cart, stripe_session_id):
        """Create an order from a user's cart"""
        order = cls.objects.create(
            user=cart.user,
            stripe_checkout_session_id=stripe_session_id,
            total_amount=cart.get_total_price(),
        )
        
        # Create PurchasedProduct records for each cart item
        for cart_item in cart.items.all():
            PurchasedProduct.objects.create(
                order=order,
                product=cart_item.product,
                price_paid=cart_item.product.price
            )
            # Mark product as sold
            cart_item.product.is_sold = True
            cart_item.product.save()
        
        return order


class PurchasedProduct(models.Model):
    """Through model to track which products were purchased in which order and at what price"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price_paid = models.DecimalField(max_digits=10, decimal_places=2)
    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('order', 'product')

    def __str__(self):
        return f"{self.product.name} - Order #{self.order.id} - ${self.price_paid}"


# Simplified UserPayment that directly references the order
class UserPayment(models.Model):
    """Payment record for an order"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_checkout_id = models.CharField(max_length=255)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    currency = models.CharField(max_length=3, default='USD')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - Order #{self.order.id} - ${self.total_amount}"

    def get_purchased_products(self):
        """Get all products that were purchased in this payment"""
        return self.order.products.all()