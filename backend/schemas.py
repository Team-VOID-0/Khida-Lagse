from symtable import Class
from pydantic import BaseModel
from typing import Optional, Union
from fastapi import UploadFile 

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
    user_name: str  # Required for identifying the user
    name: Optional[str] = None
    email: Optional[str] = None
    mobile_number: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    user_name: str
    new_password: str

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
    price: str
    description: str
    category: str
    # image: Union[bytes, None] 


class Order(BaseModel):
    user_name: str
    food_id: int
    quantity: int
    address: str

class AssignDeliveryman(BaseModel):
    order_id: int
    deliveryman_user_id: int

class FoodResponse(BaseModel):
    id: int
    name: str
    price: float
    description: str
    category: str

    class Config:
        orm_mode = True


class UpdateRoleRequest(BaseModel):
    user_id: str  # User's ID
    new_role: str  # New role to assign to the user