from django.db import models
from django.contrib.auth.models import User

# Task Tags
class TaskTags(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)
    title = models.CharField(max_length=200)
    
    def __str__(self):
        return self.title
    class Meta:
        ordering = ['title']
    

class Task(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(null=True,blank = True)
    complete = models.BooleanField(default=False)
    tag = models.ManyToManyField(TaskTags,blank=True,related_name = 'tag')
    due_date = models.DateField(blank=True,null=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['complete']

    