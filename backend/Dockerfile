FROM python:3.8-slim-buster
ENV PYTHONUNBUFFERED 1
WORKDIR /app/backend
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

RUN apt-get update && apt-get install -y --no-install-recommends netcat && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY ./entrypoint.sh /app/backend/entrypoint.sh

COPY . .

RUN chmod +x /app/backend/entrypoint.sh
ENTRYPOINT ["/app/backend/entrypoint.sh"]
