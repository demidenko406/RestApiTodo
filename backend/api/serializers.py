from django.db import models
from rest_framework import fields, serializers
from api.models import Task,TaskTags,User,DayTask

class TaskSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Task
        exclude = ('user',)
        
class TagSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = TaskTags
        exclude = ('user',)        
        
class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        # as long as the fields are the same, we can just use this
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        DayTask.objects.create(user = instance)
        return instance
    
class DayTaskSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = DayTask
        fields = ['task','id']
        
        
