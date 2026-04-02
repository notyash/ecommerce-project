import json

def save_data(file_name, changes):
    with open(f'../data/{file_name}.json', 'w') as file:
        json.dump(changes, file, indent=4, sort_keys=True)   
    
def get_data(file_name):
    with open(f'../data/{file_name}.json', 'r') as file:
        data = json.load(file)
    return data

