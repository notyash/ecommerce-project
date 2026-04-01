import json

def save_data(changes):
    with open('../data/products.json', 'w') as file:
        json.dump(changes, file, indent=4, sort_keys=True)   
    