import requests
import json

with open('./data.json', 'r') as file:
    data = json.load(file)
    
categories = []
for item in data['products']:
    if item['category'] not in categories:
        categories.append(item['category'])
print(categories)
print(len(categories))