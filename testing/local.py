from locust import HttpUser, task, between, TaskSet
import requests
import logging
import json
from http.cookies import SimpleCookie

logging.basicConfig(
    level=logging.INFO, 
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

BASE_HOST="http://pairfy.dev"

SELLER_TOKEN="session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJa2xRUzFwVVMxUk9XRGsxU3pJeVFsTlRTVmxCSWl3aWNtOXNaU0k2SWxORlRFeEZVaUlzSW1WdFlXbHNJam9pZEdWemRHVnlNVUJuYldGcGJDNWpiMjBpTENKaGRtRjBZWElpT2lKb2RIUndjem92TDJWNFlXMXdiR1V1WTI5dEwyRjJZWFJoY2k1cWNHY2lMQ0pqYjNWdWRISjVJam9pUTA4aUxDSjFjMlZ5Ym1GdFpTSTZJblJsYzNSbGNqRWlMQ0pwWVhRaU9qRTNNekU1TnpNMk1UUXNJbVY0Y0NJNk1UY3pNalUzT0RReE5IMC56SGhLUXExUGhGWlRCaFozLWVQenVnLWZUNXA2Nmw2R2p5cTRVN3VHakU0In0=; path=/; expires=Mon, 25 Nov 2024 23:46:54 GMT; samesite=none; secure; httponly"

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
                "name": "2",
                "price": 22,
                "collateral": 2,
                "sku": "2",
                "model": "2",
                "brand": "2",
                "features": "{\"type\":\"doc\",\"content\":[{\"type\":\"paragraph\",\"content\":[{\"type\":\"text\",\"text\":\"2\"}]}]}",
                "category": "electronics",
                "keywords": "2",
                "stock": 1,
                "color": "000000",
                "color_name": "2",
                "quality": "New",
                "discount": True,
                "discount_value": 2,
                "image_set": "fw7mPuVhXPAqiLaEQpVk.jpeg",
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
    host = BASE_HOST
    wait_time = between(1, 3)  