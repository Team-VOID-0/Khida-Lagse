from symtable import Class
from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class UserBase(BaseModel):
    name: str
    user_name: str
    email: str
    mobile_number: str
    password: str

class UserUpdate(BaseModel):
    user_id: str
    name: Optional[str] = None
    user_name: Optional[str] = None
    email: Optional[str] = None
    mobile_number: Optional[str] = None

class CheckUser(BaseModel):
    user_name: str
    password: str
    
class UserForgetPassword(BaseModel):
    email: str
    password: str

class UserDelete(BaseModel):
    user_name: str


class FoodCreate(BaseModel):
    name: str
    price: float
    description: str
    category: str


class Order(BaseModel):
    user_name: str
    food_id: int
    quantity: int
    

class FoodResponse(BaseModel):
    id: int
    name: str
    price: float
    description: str
    category: str

    class Config:
        orm_mode = True


