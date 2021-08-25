from django.db.models import query
from rest_framework.response import Response
from .serializers import TagSerializer, TaskSerializer,UserSerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Task,TaskTags    
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
import logging

logger = logging.getLogger('user')



class UserCreateMixin(object):
  user_field = 'user'

  def get_user_field(self):
    return self.user_field
 
  def perform_create(self, serializer):
    kwargs = {
      self.get_user_field(): self.request.user
    }

    serializer.save(**kwargs)


class MainView(UserCreateMixin,ModelViewSet):
    
    
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
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer  = self.get_serializer(instance)
        tags = TaskTags.objects.filter(user = self.request.user)
        tags_serializer = TagSerializer(tags, many=True)
        return Response({
            'tags':tags_serializer.data,
            'task':serializer.data,
            })
    
    def list(self, request, *args, **kwargs):
        tasks = Task.objects.filter(user = self.request.user)
        task_serializer = TaskSerializer(tasks, many=True)
        tags = TaskTags.objects.filter(user = self.request.user)
        tags_serializer = TagSerializer(tags, many=True)
        user = self.request.user
        user_setializer = UserSerializer(user)
        return Response({
            'tasks':task_serializer.data,
            'tags':tags_serializer.data,
            'user':user_setializer.data,
            }
        ) 


class TagViewSet(UserCreateMixin,ModelViewSet):
    
    queryset = TaskTags.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = TagSerializer
    
    def get_queryset(self):
        user = self.request.user
        return TaskTags.objects.filter(user = user)     
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer  = self.get_serializer(instance)
        tasks = Task.objects.filter(tag = instance,user = self.request.user)
        task_serializer = TaskSerializer(tasks, many=True) 
        user = self.request.user
        user_setializer = UserSerializer(user)       

        return Response({
            'tag':serializer.data,
            'tasks':task_serializer.data,
            'user':user_setializer.data,
            })
    

class Register(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class Logout(APIView):
    permission_classes = [AllowAny]
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)