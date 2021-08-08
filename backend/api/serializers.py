from rest_framework import fields, serializers
from api.models import Task,TaskTags


class TaskSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Task
        fields = ('__all__')
        
class TagSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = TaskTags
        fields = ('__all__')