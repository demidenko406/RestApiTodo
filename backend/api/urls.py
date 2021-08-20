from django.db import router
from django.urls import path
from .views import MainView, TagViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'task', MainView)
router.register(r'tag', TagViewSet)


urlpatterns = router.urls
