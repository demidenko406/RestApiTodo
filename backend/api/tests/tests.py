from django.test.utils import tag
from django.urls import reverse
from rest_framework import response, serializers, status
from rest_framework.test import APITestCase
from api.models import Task,TaskTags,DayTask,User
from rest_framework.test import APIClient
from rest_framework.test import RequestsClient
from .serializers import UserSerializer,TaskSerializer,TagSerializer,DayTaskSerializer
import logging
import datetime
import json
from django.conf import settings


logger = settings.LOGGER

test_users = [
    {"email": "mkolocej@gmail.com", "password": "AdminAdmin"},
    {"email": "m@m.com", "password": "testpassword2"},
]

class TestModels(APITestCase):
        
    #Testing models
    def test_task_tag(self):
        task1 = Task.objects.create(title="Task1",description="Task1 description",complete = "True")
        tag1 = TaskTags.objects.create(title="Tag1")
        tag2 = TaskTags.objects.create(title="Tag2")
        task1.tag.set([tag1.pk, tag2.pk])
        self.assertEqual(task1.tag.count(), 2)
        
    def test_task_user(self):
        user1 = User.objects.create(username="User1")
        task1 = Task.objects.create(title="Task1",description="Task1 description",complete = "True",user = user1)
        self.assertEqual(task1.user.pk, user1.id)
        
    def test_task_model_str(self):
        task1 = Task.objects.create(title="Task1")
        self.assertEqual(str(task1), "Task1")
    
    def test_tag_model_str(self):
        tag1 = TaskTags.objects.create(title="Tag1")
        self.assertEqual(str(tag1), "Tag1")
        
    def test_user_model_str(self):
        user1 = User.objects.create(username="User1")
        self.assertEqual(str(user1), "User1")
        
    def test_task_fields(self):
        user1 = User.objects.create(username="User1")
        task1 = Task.objects.create(title="Task1",description="Task1 description",complete = "True",user = user1,due_date = '2021-10-25')
        self.assertEqual(task1.user.pk, user1.id)
        self.assertEqual(task1.description,"Task1 description")
        self.assertEqual(task1.title,"Task1")
        self.assertEqual(task1.complete,"True")
        self.assertEqual(task1.due_date,'2021-10-25')
    
    #Testing serializers    
    def test_email_validation(self):
        serializer = UserSerializer(data = {'username':'Username','email':'m@m','password':'Password'})
        serializer.is_valid()
        self.assertEqual(serializer.errors.keys(),set(['email']))
    
    def test_password_validation(self):
        serializer = UserSerializer(data = {'username':'Username','email':'m@m.com','password':'Passw'})
        serializer.is_valid()
        self.assertEqual(serializer.errors.keys(),set(['password']))
        
    def test_username_validation(self):
        serializer = UserSerializer(data = {'username':'us','email':'m@m.com','password':'Password'})
        serializer.is_valid()
        self.assertEqual(serializer.errors.keys(),set(['username']))
    
    def test_user_deserialization(self):
        email = ('email','m@m.com')
        username = ('username', 'Username')
        password = ('password','Password')
        serializer = UserSerializer(data = {'username':'Username','email':'m@m.com','password':'Password'})
        serializer.is_valid()
        self.assertEqual(list(serializer.validated_data.items())[0],email)
        self.assertEqual(list(serializer.validated_data.items())[1],username)
        self.assertEqual(list(serializer.validated_data.items())[2],password)

    def test_user_serialization(self):
        user = User(email = 'm@m.com',username = 'TestUser',password = 'Password')
        serialized_data = {'email': 'm@m.com', 'username': 'TestUser'}
        serializer = UserSerializer(user)
        self.assertEqual(serializer.data,serialized_data)
        
    def test_task_serialization(self):
        user1 = User.objects.create(username="User1")
        task1 = Task.objects.create(title="Task1",description="Task1 description",complete = "True",user = user1)
        serialized_data = {'id': task1.id, 'title': 'Task1', 'description': 'Task1 description', 'complete': True, 'due_date': None, 'tag': []}
        serializer = TaskSerializer(task1)
        self.assertEqual(serializer.data,serialized_data)
        
    def test_task_deserialization(self):
        title = ('title','Task1')
        description = ('description', 'Task1 description')
        complete = ('complete', True)
        due_date = ('due_date', datetime.date(2021, 10, 25))
        tag = ('tag',[])
        serializer = TaskSerializer(data = {'id': 3, 'title': 'Task1', 'description': 'Task1 description', 'complete': True, 'due_date':  '2021-10-25', 'tag': []})
        serializer.is_valid()
        self.assertEqual(list(serializer.validated_data.items())[0],title)
        self.assertEqual(list(serializer.validated_data.items())[1],description)
        self.assertEqual(list(serializer.validated_data.items())[2],complete)
        self.assertEqual(list(serializer.validated_data.items())[3],due_date)
        self.assertEqual(list(serializer.validated_data.items())[4],tag)


class TestAPI(APITestCase):
    #Testing API
    def get_token(self):
        self.client.post('/api/register/',
                            data=json.dumps({
                                "email": "m@m.com",
                                "password": "TestPassword",
                                "username": "TestUser",
                            }),
                            content_type='application/json',
                            )
        res = self.client.post('/token/',
                               data=json.dumps({
                                "email": "m@m.com",
                                "password": "TestPassword",
                               }),
                               content_type='application/json',
                               )
        result = json.loads(res.content)
        return result["access"]
    
    def test_task_unauthorized_get_request(self):
        res = self.client.get('/api/task/')
        self.assertEquals(res.status_code, 401)
        
        
        
    def test_task_unauthorized_post_request(self):
        res = self.client.post('/api/task/',
                            data=json.dumps({
                            "title": "m@m.com",
                            "complete": "False",
                            }),
                            content_type='application/json',
                            )
        self.assertEquals(res.status_code, 401)
        res = self.client.post('/api/task/',
                            data=json.dumps({
                            "title": "m@m.com",
                            "complete": "False",
                            }),
                            content_type='application/json',
                            HTTP_AUTHORIZATION=f'Bearer WRONG TOKEN'
                            )
        self.assertEquals(res.status_code, 401)
        
    def test_add_task_authorized(self):
        token = self.get_token()
        res = self.client.post('/api/task/',
                            data=json.dumps({
                                'title': "Task1",
                                'description': "Task1 Description",
                                'complete': False,
                            }),
                            content_type='application/json',
                            HTTP_AUTHORIZATION=f'Bearer {token}'
                            )
        self.assertEquals(res.status_code, 201)
        logger.error(json.loads(res.content))
        result = json.loads(res.content)
        self.assertEquals(result["title"], 'Task1')
        self.assertEquals(result["description"], 'Task1 Description')
        self.assertEquals(result["complete"], False)
        
    def test_get_tasks_authorized(self):
        token = self.get_token()
        res = self.client.get('/api/task/',
                            content_type='application/json',
                            HTTP_AUTHORIZATION=f'Bearer {token}'
                            )
        logger.error(json.loads(res.content))
        self.assertEqual(res.status_code,200)
    
    def test_post_user_validation(self):
        res = self.client.post('/api/register/',
                            data=json.dumps({
                                "email": "mm.com",
                                "password": "Test",
                                "username": "TestUser",
                            }),
                            content_type='application/json',
                            )        

        self.assertEquals(res.status_code, 400)
    

    def test_add_tag_authorized(self):
        token = self.get_token()
        res = self.client.post('/api/tag/',
                            data=json.dumps({
                                'title': "Tag1",
                            }),
                            content_type='application/json',
                            HTTP_AUTHORIZATION=f'Bearer {token}'
                            )
        self.assertEquals(res.status_code, 201)
        logger.error(json.loads(res.content))
        result = json.loads(res.content)
        self.assertEquals(result["title"], 'Tag1')
    
    def test_get_tags_authorized(self):
        token = self.get_token()
        self.client.post('/api/tag/',
                            data=json.dumps({
                                'title': "Tag1",
                            }),
                            content_type='application/json',
                            HTTP_AUTHORIZATION=f'Bearer {token}'
                            )
        res = self.client.get('/api/tag/',
                            content_type='application/json',
                            HTTP_AUTHORIZATION=f'Bearer {token}'
                            )
        logger.error(f'Tags : {json.loads(res.content)}')
        self.assertEqual(res.status_code,200)
        self.assertEqual(json.loads(res.content)[0]['title'],'Tag1')