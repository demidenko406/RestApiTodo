from rest_framework.response import Response
from api.serializers import TagSerializer, TaskSerializer
from django.shortcuts import render
from rest_framework.views import APIView
from .models import Task,TaskTags    
from rest_framework.response import Response



class MainView(APIView):

    def get(self, request, format=None):
        tasks = Task.objects.all()
        task_serializer = TaskSerializer(tasks, many=True)
        tags = TaskTags.objects.all()
        tags_serializer = TagSerializer(tags, many=True)
        return Response({
            'tasks':task_serializer.data,
            'tags':tags_serializer.data
            }
            )

