import json 
from fastapi import HTTPException, APIRouter
from pydantic import BaseModel
from ..utils.utils import save_data


router = APIRouter()

class CartProduct(BaseModel):
    product_id: int

class AddToCart(BaseModel):
    cart_id: int
    user_id: int
    product: list[CartProduct]
    
class UpdateCart(BaseModel):
    id: int

with open('./data/carts.json') as file:
    data = json.load(file)

@router.post('/{cart_id}')
def add_to_cart(cart:AddToCart, cart_id: int):
    cartExists = next((cart for cart in data['carts'] if cart['id'] == cart_id), None)
    if not cartExists:
        new_cart = {
            'cart_id': cart_id,
            'user_id': cart.user_id,
            'products': []
        }
        data['carts'].append(new_cart)
    