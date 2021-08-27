from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    username = models.CharField(max_length=255)
    email = models.EmailField(max_length=255,unique=True)
    password = models.CharField(max_length=255)  
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    def __str__(self):
        return self.username
    

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
        
        
class DayTask(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,blank=True,null=True)
    task = models.ForeignKey(Task,null=True,blank=True,on_delete=models.SET_NULL)
    
    def create_day(self, user):
        task = self.create(user = user)
        return task

    