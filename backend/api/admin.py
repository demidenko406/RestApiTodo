from django.contrib import admin
from .models import Task,TaskTags,User

admin.site.register(Task)
admin.site.register(TaskTags)
admin.site.register(User)
