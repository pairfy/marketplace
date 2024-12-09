from locust import HttpUser, task, between, TaskSet
import requests
import logging
import json
from http.cookies import SimpleCookie
from faker import Faker
import random

fake = Faker()

logging.basicConfig(
    level=logging.INFO, 
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

SELLER_TOKEN="session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJakJEUzFOT1RFWlFNMDlWVEZGRFZ6aFVVVVl4SWl3aWNtOXNaU0k2SWxORlRFeEZVaUlzSW1WdFlXbHNJam9pZEdWemRHVnlNVUJuYldGcGJDNWpiMjBpTENKaGRtRjBZWElpT2lKb2RIUndjem92TDJWNFlXMXdiR1V1WTI5dEwyRjJZWFJoY2k1cWNHY2lMQ0pqYjNWdWRISjVJam9pUTA4aUxDSjFjMlZ5Ym1GdFpTSTZJblJsYzNSbGNqRXlNeUlzSW1saGRDSTZNVGN6TXpBNU9UZzNNaXdpWlhod0lqb3hOek16TnpBME5qY3lmUS4wZVVkbGlMSmcxaDQ4WnVHSGdQaDBRNDNJRDMzZGdOMDA3X0hTOXZHQ293In0="

class ServiceSeller(HttpUser):

    host = "http://service-seller.default.svc.cluster.local:8000"
    
    wait_time = between(1, 2)

    @task
    def healthcheck(self):
        self.client.get("/api/seller/healthcheck")

class ServiceUser(HttpUser):

    host = "http://service-user.default.svc.cluster.local:8000"
    
    wait_time = between(1, 2)

    @task
    def healthcheck(self):
        self.client.get("/api/user/healthcheck")        

class CreateProductTest(TaskSet):

    def on_start(self):
        self.jwt_token = SELLER_TOKEN

    @task
    def graphql_query(self):
        if not self.jwt_token:

            return

        query = """
        
    mutation($createProductVariable: CreateProductInput!){
        createProduct(createProductInput: $createProductVariable){
            success
        }
    }
        """
        

        variables = {
            "createProductVariable": {
                "name": "Razer Blade 16 16 Gaming Laptop - Black (Intel Core i9 14900HX/2TB SSD/32GB RAM/GeForce RTX 4090/Win 11)",
                "price": fake.random_int(min=1000, max=20999),
                "collateral": fake.random_int(min=100, max=800),
                "sku": fake.lexify(text="???-???-????-???", letters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
                "model": fake.lexify(text="Modelo ???????", letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
                "brand": "Razer",
                "features": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"kaka There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.\"}]}]}",
                "category": "electronics",
                "keywords": ",".join([fake.word() for _ in range(5)]),
                "bullet_list": ",".join([fake.word() for _ in range(5)]),
                "paused": fake.random_int(min=0, max=1),
                "color": "000000",
                "color_name": fake.color_name(),
                "quality": random.choice(["New", "Used"]),
                "discount": True,
                "discount_value": fake.random_int(min=1, max=99),
                "image_set": "uAsVBnacJdamf9wGEbXx.jpeg",
                "video_set": ""
            }
        }
        
        headers = { "Cookie":  self.jwt_token }
        
        response = self.client.post(
            "/api/product/graphql",  
            json={"query": query, "variables": variables},
            headers=headers,
        )
        
        if response.status_code == 200:
            logger.info(f"GraphQL Response JSON: {response.json()}")
        else:
            logger.error(f"GraphQL query failed. Response: {response.text}")

class ServiceProduct(HttpUser):
    tasks = [CreateProductTest]
    host = "http://service-product.default.svc.cluster.local:4000"
    wait_time = between(1, 3)  