from rest_framework.test import APITestCase
from api.models import Task, TaskTags, User
from api.serializers import UserSerializer, TaskSerializer
import datetime
import json
from django.conf import settings
import pytest

logger = settings.LOGGER


@pytest.mark.parametrize(
    "title, description,complete",
    [
        ("Task1", "Task1 description", True),
        ("Task2", "Task2 description", False),
        ("Task3", "Task3 description", True),
        ("Task4", "Task4 description", False),
        ("Task5", "Task5 description", True),
        ("Task6", "Task6 description", False),
    ],
)
def test_task_user_params(db, title, description, complete):
    task1 = Task.objects.create(title=title, description=description, complete=complete)
    logger.error("parametrize")
    assert task1.title == title
    assert task1.description == description
    assert task1.complete == complete


@pytest.fixture
def task(db) -> Task:
    return Task.objects.create(
        title="Task1", description="Task1 description", complete="True"
    )


@pytest.fixture
def user(db) -> User:
    return User.objects.create(username="User1")


@pytest.fixture
def tag(db) -> User:
    return TaskTags.objects.create(title="Tag1")


def test_task_tag(task):
    tag1 = TaskTags.objects.create(title="Tag1")
    tag2 = TaskTags.objects.create(title="Tag2")
    task.tag.set([tag1.pk, tag2.pk])
    assert task.tag.count() == 2


def test_task_user(user):
    task1 = Task.objects.create(
        title="Task1", description="Task1 description", complete="True", user=user
    )
    assert task1.user.pk == user.id


def test_task_model_str(task):
    assert str(task) == "Task1"


def test_task_model_str(tag):
    assert str(tag) == "Tag1"


def test_task_model_str(user):
    assert str(user) == "User1"


def test_task_fields(user):
    task1 = Task.objects.create(
        title="Task1",
        description="Task1 description",
        complete="True",
        user=user,
        due_date="2021-10-25",
    )
    assert task1.user.pk == user.id
    assert task1.description == "Task1 description"
    assert task1.title == "Task1"
    assert task1.complete == "True"
    assert task1.due_date == "2021-10-25"


class TestSerializers(APITestCase):
    def test_email_validation(self):
        serializer = UserSerializer(
            data={"username": "Username", "email": "m@m", "password": "Password"}
        )
        serializer.is_valid()
        assert serializer.errors.keys() == set(["email"])

    def test_password_validation(self):
        serializer = UserSerializer(
            data={"username": "Username", "email": "m@m.com", "password": "Passw"}
        )
        serializer.is_valid()
        assert serializer.errors.keys() == set(["password"])

    def test_username_validation(self):
        serializer = UserSerializer(
            data={"username": "us", "email": "m@m.com", "password": "Password"}
        )
        serializer.is_valid()
        assert serializer.errors.keys() == set(["username"])

    def test_user_deserialization(self):
        email = ("email", "m@m.com")
        username = ("username", "Username")
        password = ("password", "Password")
        serializer = UserSerializer(
            data={"username": "Username", "email": "m@m.com", "password": "Password"}
        )
        serializer.is_valid()
        assert list(serializer.validated_data.items())[0] == email
        assert list(serializer.validated_data.items())[1] == username
        assert list(serializer.validated_data.items())[2] == password

    def test_user_serialization(self):
        user = User(email="m@m.com", username="TestUser", password="Password")
        serialized_data = {"email": "m@m.com", "username": "TestUser"}
        serializer = UserSerializer(user)
        assert serializer.data == serialized_data

    def test_task_serialization(self):
        user1 = User.objects.create(username="User1")
        task1 = Task.objects.create(
            title="Task1", description="Task1 description", complete="True", user=user1
        )
        serialized_data = {
            "id": task1.id,
            "title": "Task1",
            "description": "Task1 description",
            "complete": True,
            "due_date": None,
            "tag": [],
        }
        serializer = TaskSerializer(task1)
        assert serializer.data == serialized_data

    def test_task_tag_deserialization(self):
        title = ("title", "Task1")
        description = ("description", "Task1 description")
        complete = ("complete", True)
        due_date = ("due_date", datetime.date(2021, 10, 25))
        tag = ("tag", [])
        serializer = TaskSerializer(
            data={
                "id": 3,
                "title": "Task1",
                "description": "Task1 description",
                "complete": True,
                "due_date": "2021-10-25",
                "tag": [],
            }
        )
        serializer.is_valid()
        assert list(serializer.validated_data.items())[0] ==  title
        assert list(serializer.validated_data.items())[1] ==  description
        assert list(serializer.validated_data.items())[2] == complete
        assert list(serializer.validated_data.items())[3] == due_date
        assert list(serializer.validated_data.items())[4] == tag


class TestAPI(APITestCase):
    # Testing API
    def get_token(self):
        self.client.post(
            "/api/register/",
            data=json.dumps(
                {
                    "email": "m@m.com",
                    "password": "TestPassword",
                    "username": "NewTestUser",
                }
            ),
            content_type="application/json",
        )
        res = self.client.post(
            "/token/",
            data=json.dumps(
                {
                    "email": "m@m.com",
                    "password": "TestPassword",
                }
            ),
            content_type="application/json",
        )
        result = json.loads(res.content)
        return result["access"]

    def test_task_unauthorized_get_request(self):
        res = self.client.get("/api/task/")
        self.assertEquals(res.status_code, 401)

    def test_task_unauthorized_post_request(self):
        res = self.client.post(
            "/api/task/",
            data=json.dumps(
                {
                    "title": "m@m.com",
                    "complete": "False",
                }
            ),
            content_type="application/json",
        )
        self.assertEquals(res.status_code, 401)
        res = self.client.post(
            "/api/task/",
            data=json.dumps(
                {
                    "title": "m@m.com",
                    "complete": "False",
                }
            ),
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer WRONG TOKEN",
        )
        self.assertEquals(res.status_code, 401)

    def test_add_task_authorized(self):
        token = self.get_token()
        res = self.client.post(
            "/api/task/",
            data=json.dumps(
                {
                    "title": "Task1",
                    "description": "Task1 Description",
                    "complete": False,
                }
            ),
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {token}",
        )
        self.assertEquals(res.status_code, 201)
        logger.error(json.loads(res.content))
        result = json.loads(res.content)
        self.assertEquals(result["title"], "Task1")
        self.assertEquals(result["description"], "Task1 Description")
        self.assertEquals(result["complete"], False)

    def test_get_tasks_authorized(self):
        token = self.get_token()
        res = self.client.get(
            "/api/task/",
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {token}",
        )
        logger.error(json.loads(res.content))
        assert res.status_code == 200

    def test_post_user_validation(self):
        res = self.client.post(
            "/api/register/",
            data=json.dumps(
                {
                    "email": "mm.com",
                    "password": "Test",
                    "username": "TestUser",
                }
            ),
            content_type="application/json",
        )

        self.assertEquals(res.status_code, 400)

    def test_add_tag_authorized(self):
        token = self.get_token()
        res = self.client.post(
            "/api/tag/",
            data=json.dumps(
                {
                    "title": "Tag1",
                }
            ),
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {token}",
        )
        self.assertEquals(res.status_code, 201)
        logger.error(json.loads(res.content))
        result = json.loads(res.content)
        self.assertEquals(result["title"], "Tag1")

    def test_get_tags_authorized(self):
        token = self.get_token()
        self.client.post(
            "/api/tag/",
            data=json.dumps(
                {
                    "title": "Tag1",
                }
            ),
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {token}",
        )
        res = self.client.get(
            "/api/tag/",
            content_type="application/json",
            HTTP_AUTHORIZATION=f"Bearer {token}",
        )
        logger.error(f"Tags : {json.loads(res.content)}")
        assert res.status_code ==  200
        assert json.loads(res.content)[0]["title"] ==  "Tag1"
