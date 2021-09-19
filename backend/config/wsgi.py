"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = get_wsgi_application()
    # db:
    #   image: postgres:12.0-alpine
    #   volumes:
    #     - ./postgres_data/:/var/lib/postgresql/data/
    #   environment:
    #     - POSTGRES_DB=todolist
    #     - POSTGRES_USER=kalacey412
    #     - POSTGRES_PASSWORD=kalaceydb412