from django.contrib import admin
from .models import Task,TaskTags

admin.site.register(Task)
admin.site.register(TaskTags)
