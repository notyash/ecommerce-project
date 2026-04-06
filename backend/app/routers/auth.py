from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import HTTPException, APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from ..utils.utils import get_data, save_data
from pwdlib import PasswordHash
import jwt 
from jwt.exceptions import InvalidTokenError
import uuid
from ..redis_client import redis_client

SECRET_KEY = 'e59f7f1ca5a8e84dfaa10c10e99058967563d86b1e1e6c99f1b09b3fbcec7b7f'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30
TOKEN_EXPIRES = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("dummypassword")

INVALID_USERNAME_OR_PASSWORD = HTTPException(status_code=401,
                                             detail='Invalid username or password!',
                                             headers={'WWW-Authenticate': 'Bearer'})

INVALID_TOKEN = HTTPException(status_code=401, detail='Invalid token!')

class User(BaseModel):
    username: str
    fullname: str | None = None
    gender: str | None = None
    age: int | None = None

class UserInfo(User):
    password: str

class UserInDB(User):
    hashed_password: str
    disabled: bool | None = None

class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenData(BaseModel):
    sub: str
    jti: str
    exp: int
    
def get_hashed_password(password):
    return password_hash.hash(password)

def verify_password(plain_password, hash_password):
    return password_hash.verify(plain_password, hash_password)

def get_user(db, username: str):
    user = next((u for u in db if u['username'] == username), None)
    if user:
        return UserInDB(**user)
    
def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        verify_password(password, DUMMY_HASH)
        raise INVALID_USERNAME_OR_PASSWORD
    elif not verify_password(password, user.hashed_password):
        raise INVALID_USERNAME_OR_PASSWORD
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    jti = str(uuid.uuid4())
    to_encode.update({'exp': expire, 'jti': jti})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
    
async def blacklist_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        jti = payload.get('jti')
        exp = payload.get('exp')
        if None in [jti, exp]:
            raise INVALID_TOKEN
        ttl = int(exp - datetime.now(timezone.utc).timestamp())
        if ttl > 0:
            await redis_client.setex(jti, ttl, 'Blacklisted')
    except InvalidTokenError:
        raise INVALID_TOKEN
    
async def check_blacklist(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        jti = payload.get('jti')
        if not jti:
            raise INVALID_TOKEN
    except InvalidTokenError:
        raise INVALID_TOKEN
    
    if await redis_client.get(jti):
        raise INVALID_TOKEN
    return TokenData(**payload)
    
def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    users_data = get_data('users')
    all_users = users_data['users']
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get('sub')
        if not username:
            raise INVALID_USERNAME_OR_PASSWORD
    except InvalidTokenError:
        raise INVALID_USERNAME_OR_PASSWORD
    user = get_user(all_users, username=username)
    if not user:
        raise INVALID_USERNAME_OR_PASSWORD
    return user 

def get_current_active_user(current_user: Annotated[UserInDB, Depends(get_current_user)]):
    if current_user.disabled:
        raise HTTPException(status_code=401, detail='Banned User!')
    return current_user

@router.post('/signup')
async def sign_up(user: UserInfo):
    users_data = get_data('users')
    all_users = users_data['users']
    user_exists = next((u for u in all_users if u['username'] == user.username), None)
    if user_exists:
        raise HTTPException(status_code=409, detail=f"Username {user.username} is taken!")
    
    new_id = all_users[-1]["id"] + 1 if all_users else 1
    hashed_password = get_hashed_password(user.password)
    token = create_access_token({"sub": user.username}, expires_delta=TOKEN_EXPIRES)

    user = user.model_dump(exclude_none=True)
    user.pop('password')
    all_users.append({**user, 'id': new_id, 'hashed_password': hashed_password, 'disabled': False})
    save_data('users', users_data)
    
    return Token(access_token=token, token_type='Bearer')

@router.post('/login')
async def log_in(current_user: UserInfo):
    users_data = get_data('users')
    all_users = users_data['users']
    user = authenticate_user(all_users, current_user.username, current_user.password)
    token = create_access_token(data={'sub': user.username}, expires_delta=TOKEN_EXPIRES)
    return Token(access_token=token, token_type='Bearer')

@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    await blacklist_token(token)
    return {"message": "Logged out"}

@router.get("/protected")
async def protected_route(payload: Annotated[TokenData, Depends(check_blacklist)]):
    return {"message": "You're in", "user": payload.sub}    