from rest_framework import serializers
from rest_framework import response
from rest_framework.response import Response
from .serializers import TagSerializer, TaskSerializer,UserSerializer
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView
from rest_framework import status
from .models import Task,TaskTags    
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet,GenericViewSet
from rest_framework.mixins import CreateModelMixin,UpdateModelMixin,DestroyModelMixin,ListModelMixin

class MainView(ModelViewSet):
    
    permission_classes = [IsAuthenticated]
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer  = self.get_serializer(instance)
        tags = TaskTags.objects.all()
        tags_serializer = TagSerializer(tags, many=True)
        return Response({
            'tags':tags_serializer.data,
            'task':serializer.data,
            })
    
    def list(self, request, *args, **kwargs):
        tasks = Task.objects.all()
        task_serializer = TaskSerializer(tasks, many=True)
        tags = TaskTags.objects.all()
        tags_serializer = TagSerializer(tags, many=True)
        return Response({
            'tasks':task_serializer.data,
            'tags':tags_serializer.data
            }
        ) 


class TagViewSet(ModelViewSet):
    
    permission_classes = [IsAuthenticated]
    queryset = TaskTags.objects.all()
    serializer_class = TagSerializer
    
    def list(self, request, *args, **kwargs):
        tags = TaskTags.objects.all()
        response = TagSerializer(tags, many=True)
        return Response(response.data)
    
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer  = self.get_serializer(instance)
        print(serializer.data)
        tasks = Task.objects
        task_serializer = TaskSerializer(tasks, many=True)
        tags = TaskTags.objects.all()
        tags_serializer = TagSerializer(tags, many=True)
        

        return Response({
            'tag':serializer.data,
            'tasks':task_serializer.data,
            })




class Register(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)