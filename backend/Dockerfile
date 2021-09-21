FROM python:3.8-slim-buster
ENV PYTHONUNBUFFERED 1
WORKDIR /app/backend
COPY requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN pip install gunicorn
RUN pip install -r requirements.txt

COPY . .