from django.db import models
from rest_framework import fields, serializers
from rest_framework.exceptions import ValidationError
from api.models import Task, TaskTags, User, DayTask
from django.conf import settings

logger = settings.LOGGER


class TaskSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Task
        exclude = ("user",)

        
class TagSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = TaskTags
        exclude = ("user",)

class TaskListSerializer(serializers.ModelSerializer):
    tag = TagSerializer(many=True)
    class Meta:
        model = Task
        exclude = ("user",)

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True)

    class Meta:

        model = User
        fields = ("email", "username", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, value):
        if len(value) < 8:
            logger.warning("Wrong password was provided")
            raise serializers.ValidationError(
                "Password is too short. Enter at least 8 symbols"
            )
        return value

    def validate_email(self, value):
        if len(value) < 5:
            logger.warning("Wrong email was provided")
            raise serializers.ValidationError(
                "Email is too short. Enter at least 5 symbols"
            )
        return value

    def validate_username(self, value):
        if len(value) < 5:
            logger.warning("Wrong username was provided")
            raise serializers.ValidationError(
                "Username is too short. Enter at least 5 symbols"
            )
        return value

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        logger.info("User was created")
        DayTask.objects.create(user=instance)
        return instance


class DayTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = DayTask
        fields = ["task", "id"]
