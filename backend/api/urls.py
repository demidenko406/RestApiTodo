from django.urls import path
from .views import MainView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'task', MainView)


urlpatterns = router.urls
