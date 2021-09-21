from re import sub
from django.db.models import query
from rest_framework import status
from rest_framework.generics import UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from django.core.mail import message, send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from .models import DayTask, Task, TaskTags
from .serializers import (
    DayTaskSerializer,
    TagSerializer,
    TaskSerializer,
    UserSerializer,
    TaskListSerializer
)
import asyncio
import threading
from django.conf import settings
from asgiref.sync import sync_to_async

logger = settings.LOGGER


def async_email(name, email):
    subject = 'User was created'
    message = f'Hello {name}, your registration is complete.'
    return send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])


class UserCreateMixin(object):
    user_field = "user"

    def get_user_field(self):
        return self.user_field

    def perform_create(self, serializer):
        kwargs = {self.get_user_field(): self.request.user}
        serializer.save(**kwargs)


class MainView(UserCreateMixin, ModelViewSet):
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        tags = TaskTags.objects.filter(user=self.request.user)
        tags_serializer = TagSerializer(tags, many=True)
        return Response(
            {
                "tags": tags_serializer.data,
                "task": serializer.data,
            }
        )

    def list(self, request, *args, **kwargs):
        tasks = Task.objects.filter(user=self.request.user)
        task_serializer = TaskListSerializer(tasks, many=True)
        tags = TaskTags.objects.filter(user=self.request.user)
        tags_serializer = TagSerializer(tags, many=True)
        user = self.request.user
        user_setializer = UserSerializer(user)
        day_task = DayTask.objects.filter(user=self.request.user)
        day_serializer = DayTaskSerializer(day_task, many=True)
        logger.debug("MainView was requested")
        return Response(
            {
                "tasks": task_serializer.data,
                "tags": tags_serializer.data,
                "user": user_setializer.data,
                "day_task": day_serializer.data,
            }
        )


class TagViewSet(UserCreateMixin, ModelViewSet):

    queryset = TaskTags.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = TagSerializer

    def get_queryset(self):
        user = self.request.user
        return TaskTags.objects.filter(user=user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        tasks = Task.objects.filter(tag=instance, user=self.request.user)
        task_serializer = TaskSerializer(tasks, many=True)
        user = self.request.user
        user_setializer = UserSerializer(user)
        logger.info("TagView was toggled")
        return Response(
            {
                "tag": serializer.data,
                "tasks": task_serializer.data,
                "user": user_setializer.data,
            }
        )


class Register(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            if user:
                json = serializer.data
                mail_task = threading.Thread(target=async_email, args=(
                    user.username, user.email), daemon=True)
                mail_task.start()
                return Response(json, status=status.HTTP_201_CREATED)
        logger.warning("Unsuccesful registration attempt")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Logout(APIView):
    permission_classes = [AllowAny]
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            logger.info("User was logged out")
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CreateDayTask(UpdateAPIView):

    serializer_class = DayTaskSerializer
    queryset = DayTask.objects.all()
    permission_classes = [IsAuthenticated]
