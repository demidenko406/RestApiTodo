from django.db import router
from django.urls import path, include
from .views import MainView, TagViewSet, Register, Logout, CreateDayTask
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"task", MainView)
router.register(r"tag", TagViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("register/", Register.as_view(), name="register"),
    path("logout/", Logout.as_view(), name="logout"),
    path("day-task/<int:pk>/", CreateDayTask.as_view(), name="day-task"),
]
