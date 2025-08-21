from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DropViewSet, CategoryViewSet, ProductViewSet
from .webhook import stripe_webhook
from . import views

router = DefaultRouter()
router.register(r'drops', DropViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('stripe/webhook/', stripe_webhook, name='stripe-webhook'),
    path("create-checkout-session/", views.create_checkout_session, name="checkout_session"),
    path('api/cart/', views.get_cart, name='get_cart'),
    path('api/cart/add/', views.add_to_cart, name='add_to_cart'),
    path('api/cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),
    path('api/drops/', views.DropViewSet.as_view, name ='drop-list'),
]