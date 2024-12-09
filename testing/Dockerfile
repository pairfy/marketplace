
FROM python:3.10-slim


WORKDIR /app


COPY . .

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8089 5557 5558

RUN ["sh", "-c", "locust --version"]

CMD ["sh", "-c", "locust -f locustfile.py"]