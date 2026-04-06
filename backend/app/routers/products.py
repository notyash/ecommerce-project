import json 
from fastapi import HTTPException, APIRouter
from pydantic import BaseModel
from ..utils.utils import save_data

router = APIRouter()

class CreateProduct(BaseModel):
    product_id: int
    title: str
    category: str
    price: float
    description: str | None = None
    rating: float | None = None
    thumbnail: str | None = None

class UpdateProduct(BaseModel):
    product_id: int | None = None
    title: str | None = None
    category: str | None = None
    price: float | None = None
    description: str | None = None
    rating: float | None = None
    thumbnail: str | None = None

with open('./data/products.json', 'r') as file:
    data =  json.load(file)

@router.get('/')
async def get_all_products():
    return data['products']

@router.get('/{product_id}')
async def get_product(product_id: int):
    for product in data['products']:
        if product['id'] == product_id:
            return product
    raise HTTPException(status_code=404, detail=f'product with id:{product_id} not found')
 
@router.post('/')
async def create_product(product: CreateProduct):
    productExists = next((item for item in data['products'] if item['id'] == product.id), None)
    if productExists:
        raise HTTPException(status_code=409, detail=f'Product with id: {product.id} already exists!')
    
    product = product.model_dump(exclude_none=True)
    data['products'].append(product)
    save_data('products', data)
    return product

@router.put('/{product_id}')
async def update_product(product: UpdateProduct, product_id: int):
    productExists = next((item for item in data['products'] if item['id'] == product_id), None)
    if not productExists:
        raise HTTPException(status_code=404, detail=f'Product with id: {product.id} does not exist!')
    
    product = product.model_dump(exclude_none=True)
    for item in data['products']:
        if product_id == item['id']:
            item.update(product)
            break
        
    save_data('products', data)
    return productExists

@router.delete('/{product_id}')
async def delete_product(product_id: int):
    productExists = next((item for item in data['products'] if item['id'] == product_id), None)
    if not productExists:
        raise HTTPException(status_code=404, detail=f'Product with id: {product_id} does not exist!')

    for item in data['products']:
        if item['id'] == product_id:
            data['products'].remove(item)
            break
    
    save_data('products', data)    
    return productExists
