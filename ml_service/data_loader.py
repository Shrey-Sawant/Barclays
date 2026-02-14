import json

def load_customers(path):
    with open(path, "r") as f:
        return json.load(f)
