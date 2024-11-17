from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class UserBase(BaseModel):
    name: str
    user_name: str
    email: str
    mobile_number: str
    password: str

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



class FoodResponse(BaseModel):
    id: int
    name: str
    price: float
    description: str
    category: str

    class Config:
        orm_mode = True