from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DropViewSet, CategoryViewSet, ProductViewSet
from . import views

router = DefaultRouter()
router.register(r'drops', DropViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('stripe/webhook/', views.stripe_webhook, name='stripe-webhook'),  # Use views.stripe_webhook
    path("create-checkout-session/", views.create_checkout_session, name="checkout_session"),
    path('cart/', views.get_cart, name='get_cart'),
    path('cart/add/', views.add_to_cart, name='add_to_cart'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('cancel-reservation/', views.cancel_reservation, name='cancel_reservation'),
]