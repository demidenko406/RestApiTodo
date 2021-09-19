FROM python:3.8-slim-buster
ENV PYTHONUNBUFFERED 1
WORKDIR /app/backend
COPY ./backend/requirements.txt requirements.txt
RUN pip install --upgrade pip
RUN pip install gunicorn
RUN pip3 install -r requirements.txt

COPY ./backend/ /app/backend/