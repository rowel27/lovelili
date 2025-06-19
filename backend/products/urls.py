from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DropViewSet, CategoryViewSet, ProductViewSet

router = DefaultRouter()
router.register(r'drops', DropViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]