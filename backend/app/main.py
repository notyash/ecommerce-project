from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import products, cart, auth

app = FastAPI()
app.include_router(prefix='/products', router=products.router)
app.include_router(prefix='/cart', router=cart.router)
app.include_router(prefix='/auth', router=auth.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
    
@app.get('/')
async def root():
    return {'message': 'Hello World'}          
 