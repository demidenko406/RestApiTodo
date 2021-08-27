from django.contrib import admin
from .models import Task,TaskTags,User,DayTask

admin.site.register(Task)
admin.site.register(TaskTags)
admin.site.register(User)
admin.site.register(DayTask)
