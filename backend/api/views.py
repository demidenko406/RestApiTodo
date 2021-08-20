from rest_framework import serializers
from rest_framework.response import Response
from .serializers import TagSerializer, TaskSerializer
from django.shortcuts import render
from rest_framework.views import APIView
from .models import Task,TaskTags    
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet,GenericViewSet
from rest_framework.mixins import CreateModelMixin,UpdateModelMixin,DestroyModelMixin,ListModelMixin



class MainView(ModelViewSet):
    
    
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
    
    
    queryset = TaskTags.objects.all()
    serializer_class = TagSerializer
    
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer  = self.get_serializer(instance)
        print(serializer.data)
        tasks = Task.objects.filter(tag = instance)
        task_serializer = TaskSerializer(tasks, many=True)
        tags = TaskTags.objects.all()
        tags_serializer = TagSerializer(tags, many=True)
        

        return Response({
            'tag':serializer.data,
            'tasks':task_serializer.data,
            })




