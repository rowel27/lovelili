from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DropViewSet, CategoryViewSet, ProductViewSet, StripeCheckoutView
from .webhook import stripe_webhook

router = DefaultRouter()
router.register(r'drops', DropViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('create-checkout-session/<int:product_id>/', StripeCheckoutView.as_view(), name='create-checkout-session'),
    path('stripe/webhook/', stripe_webhook, name='stripe-webhook'),
]