from faker import Faker
import json
import random

fake = Faker()


producto = fake.word() 
modelo = fake.lexify(text="Modelo ?????", letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ")  
color = fake.color_name()  
price = fake.random_int(min=1000, max=20999);
sku = fake.lexify(text="???-???-????", letters="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ")  
features = str({"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text": fake.sentence(nb_words=10) }]}]})
keywords= ",".join([fake.word() for _ in range(5)])
quality=random.choice(["New", "Used"])

print(f"Producto: {producto}")
print(f"Modelo: {modelo}")
print(f"Color: {color}")
print(f"Price: {price}")
print(f"Sku: {sku}")
print(f"Features: {features}")
print(f"Keywords: {keywords}")
print(f"Quality: {quality}")