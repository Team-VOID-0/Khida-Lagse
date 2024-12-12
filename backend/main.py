from fastapi import FastAPI, Depends,  status, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from jose import jwt
import bcrypt
import models, schemas
from database import engine, SessionLocal
from fastapi.middleware.cors import CORSMiddleware
import random
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta, timezone
from typing import Union
from io import BytesIO
from fastapi.responses import StreamingResponse
from sqlalchemy import func


app = FastAPI()


SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


origins = ["*"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)


models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==================
# User Management
# ==================
@app.post("/user_registration/", status_code=status.HTTP_201_CREATED, tags=["User Management"])
def create_user(requested_user: schemas.UserBase, db: Session = Depends(get_db)):
    print(requested_user) 
    salt = bcrypt.gensalt()
    id = ""
    for i in range(10):
        id += str(random.randint(0,9))
    hashed_password = bcrypt.hashpw(requested_user.password.encode(), salt)
    hashed_login_id = bcrypt.hashpw(id.encode(), salt)
    check_user_mail = db.query(models.User).filter(models.User.email == requested_user.email).first()
    check_user_name = db.query(models.User).filter(models.User.user_name == requested_user.user_name).first()
    check_user_mobile = db.query(models.User).filter(models.User.mobile_number == requested_user.mobile_number).first()
    if check_user_mail is not None:
        return {"detail": "Email already used"}
    elif check_user_name is not None:
        return {"detail": "Username already taken"}
    elif check_user_mobile is not None:
        return {"detail": "Mobile Number already used"}
    else:
        new_user = models.User(name = requested_user.name,
                               user_name = requested_user.user_name, 
                               email = requested_user.email,
                               mobile_number = requested_user.mobile_number, 
                               is_active = "0",
                               user_id = id,
                               salt = salt)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        new_user_password = models.Login(password = hashed_password, 
                                         user_id = hashed_login_id)
        db.add(new_user_password)
        db.commit()
        db.refresh(new_user_password)

        user_otp = ""
        for i in range(5):
            user_otp += str(random.randint(0,9))
        send_otp(requested_user.email, user_otp)
        new_user_otp = models.OTP(email = requested_user.email, 
                                  otp = user_otp)
        db.add(new_user_otp)
        db.commit()
        db.refresh(new_user_otp)
        return {"detail": "OTP Sent"}
    

@app.get("/user_login/{user_name}/{password}", tags=["User Management"])
def login(user_name, password, db: Session = Depends(get_db)):
    get_role = db.query(models.Login).filter(models.Login.role == "user").first()
    get_user_name = db.query(models.User).filter(models.User.user_name == user_name).first()
    if get_role is None:
        return {"detail": "Please do the registration first"}
    else:
        if get_user_name is None:
            return {"detail": "Please do the registration first"}
        else:
            hashed_user_id = bcrypt.hashpw(get_user_name.user_id.encode(), get_user_name.salt if isinstance(get_user_name.salt, bytes) else get_user_name.salt.encode())
            result_set = db.query(models.Login).filter(models.Login.user_id == hashed_user_id).first() 
            if bcrypt.checkpw(get_user_name.user_id.encode(), result_set.user_id):       
                if get_user_name.is_active == "1":  
                    hashed_password = result_set.password
                    if bcrypt.checkpw(password.encode(), hashed_password):
                        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
                        access_token = create_access_token(data={"sub": user_name}, expires_delta=access_token_expires)
                        return schemas.Token(access_token=access_token, token_type="bearer")
                    else:
                        return {"detail": "invalid username or password"}
                else:
                    return {"detail": "Activate your account by using OTP"}   


@app.put("/user_update/", tags=["User Management"])
def update_user(update_data: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == update_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if update_data.name:
        user.name = update_data.name
    if update_data.user_name:
        existing_user = db.query(models.User).filter(models.User.user_name == update_data.user_name).first()
        if existing_user and existing_user.user_id != update_data.user_id:
            raise HTTPException(status_code=400, detail="Username already taken")
        user.user_name = update_data.user_name
    if update_data.email:
        existing_email = db.query(models.User).filter(models.User.email == update_data.email).first()
        if existing_email and existing_email.user_id != update_data.user_id:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = update_data.email
    if update_data.mobile_number:
        existing_mobile = db.query(models.User).filter(models.User.mobile_number == update_data.mobile_number).first()
        if existing_mobile and existing_mobile.user_id != update_data.user_id:
            raise HTTPException(status_code=400, detail="Mobile number already in use")
        user.mobile_number = update_data.mobile_number
    db.commit()
    db.refresh(user)
    return {"detail": "User updated successfully"}

    
@app.post("/delete_user_account/", tags=["User Management"])
def user_delete(delete_user: schemas.UserDelete, db: Session = Depends(get_db)):
    check_user_name = db.query(models.User).filter(models.User.user_name == delete_user.user_name).first()
    if check_user_name is None:
        return {"detail": "Something went wrong"}
    else:
        hashed_user_id = bcrypt.hashpw(check_user_name.user_id.encode(), check_user_name.salt if isinstance(check_user_name.salt, bytes) else check_user_name.salt.encode())
        db.query(models.Login).filter(models.Login.user_id == hashed_user_id).delete()
        db.query(models.User).filter(models.User.user_name == delete_user.user_name).delete()
        db.query(models.OTP).filter(models.OTP.email == check_user_name.email).delete()
        db.commit()
        return {"detail": "Account deleted"}    
    

# ==================
# OTP Management
# ==================
@app.get("/verify_otp/{email}/{otp}", tags=["OTP Management"])
def verify_otp(email, otp, db: Session = Depends(get_db)):
    check_otp = db.query(models.OTP).filter(models.OTP.email == email).first()
    if check_otp is not None:
        if check_otp.otp == otp:
            activate = db.query(models.User).filter(models.User.email == check_otp.email).first()
            if activate is not None:
                activate.is_active = "1"
                db.commit()
                db.query(models.OTP).filter(models.OTP.email == email).delete()
                db.commit()
                return {"detail": "OTP used"}
        else:
            return {"detail": "Wrong OTP"}
    else:
        return {"detail": "No such user"}
    

@app.get("/resend_otp/{email}", tags=["OTP Management"])
def verify_otp(email, db: Session = Depends(get_db)):
    check_otp = db.query(models.OTP).filter(models.OTP.email == email).first()
    if check_otp is not None:
        db.query(models.OTP).filter(models.OTP.email == email).delete()
        db.commit()
        user_otp = ""
        for i in range(5):
            user_otp += str(random.randint(0,9))
        send_otp(email, user_otp)
        new_user_otp = models.OTP(email = email, 
                                  otp = user_otp)
        db.add(new_user_otp)
        db.commit()
        db.refresh(new_user_otp)
        return {"detail": "OTP Sent"}
    else:
        return {"detail": "No such user"}


# ==================
# Password Management
# ==================
@app.post("/forget_password/", tags=["Password Management"])
def user_forget_password(forget_user_password: schemas.UserForgetPassword, db: Session = Depends(get_db)):
    check_user_mail = db.query(models.User).filter(models.User.email == forget_user_password.email).first()
    if check_user_mail is not None:
        if check_user_mail.is_active == "1":
            check_user_password = db.query(models.Login).filter(models.Login.id == check_user_mail.id).first()
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(forget_user_password.password.encode(), salt)
            check_user_mail.is_active = "0"
            db.commit()
            check_user_password.password = hashed_password
            db.commit()
            user_otp = ""
            for i in range(5):
                user_otp += str(random.randint(0,9))
            send_otp(forget_user_password.email, user_otp)
            new_user_otp = models.OTP(email = forget_user_password.email, 
                                    otp = user_otp)
            db.add(new_user_otp)
            db.commit()
            db.refresh(new_user_otp)
            return {"detail": "OTP Sent"}
        else:
            return {"detail": "No account on this email"}
    else:
        return {"detail": "No account on this email"}
    

# ==================
# Delivery Man Management
# ==================
@app.get("/delivery_man_login/{user_id}/{password}", tags=["Delivery Man Management"])
def login(user_id, password, db: Session = Depends(get_db)):
    get_role = db.query(models.Login).filter(models.Login.role == "delivery_man")
    if get_role is None:
        return {"detail": "Invalid attempt"}
    else:
        get_user_id = db.query(models.Login).filter(models.Login.user_id == user_id).first()
        if get_user_id is None:
            return {"detail": "Invalid attempt"}
        else:
            get_user_password = db.query(models.Login).filter(models.Login.password == password).first()
            if get_user_password is None:
                return {"detail": "Invalid attempt"}
            else:
                return {"detail": "Login successfully done"}


# ==================
# Admin Management
# ==================
@app.get("/admin_login/{user_id}/{password}", tags=["Admin Management"])
def login(user_id, password, db: Session = Depends(get_db)):
    get_role = db.query(models.Login).filter(models.Login.role == "admin")
    if get_role is None:
        return {"detail": "Invalid attempt"}
    else:
        get_user_id = db.query(models.Login).filter(models.Login.user_id == user_id).first()
        if get_user_id is None:
            return {"detail": "Invalid attempt"}
        else:
            get_user_password = db.query(models.Login).filter(models.Login.password == password).first()
            if get_user_password is None:
                return {"detail": "Invalid attempt"}
            else:
                return {"detail": "Login successfully done"}
            

@app.delete("/delete_account/{user_id}/", tags=["Admin Management"])
def delete_food(user_id: int, db: Session = Depends(get_db)):
    food_item = db.query(models.Login).filter(models.Login.user_id == user_id).first()
    if not food_item:
        raise HTTPException(status_code=404, detail="User item not found")

    db.delete(food_item)
    db.commit()

    return {"detail": "User deleted successfully"}
            

# ==================
# Food Management
# ==================

# Add food item
@app.post("/food/", tags=["Food Management"])
async def add_food(
    food: schemas.FoodCreate = Depends(),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    image_data = await image.read()
    new_food = models.Food(
        name=food.name,
        image=image_data,
        price=food.price,
        description=food.description,
        category=food.category
    )
    db.add(new_food)
    db.commit()
    db.refresh(new_food)
    return {"detail": "Food item created", "food_id": new_food.id}


# Get all food items
@app.get("/foods/", tags=["Food Management"])
def get_all_foods(db: Session = Depends(get_db)):
    foods = db.query(models.Food).all()

    # Construct response with image URL for each food item
    food_list = []
    for food in foods:
        food_list.append({
            "id": food.id,
            "name": food.name,
            "price": food.price,
            "description": food.description,
            "category": food.category,
            "image_url": f"http://localhost:8000/food/{food.id}/image"
        })
    return food_list


# Get a single food item by ID
@app.get("/food/{food_id}/", tags=["Food Management"])
def get_food(food_id: int, db: Session = Depends(get_db)):
    food_item = db.query(models.Food).filter(models.Food.id == food_id).first()
    if not food_item:
        raise HTTPException(status_code=404, detail="Food item not found")
    return {
        "id": food_item.id,
        "name": food_item.name,
        "price": food_item.price,
        "description": food_item.description,
        "category": food_item.category,
        "image_url": f"http://localhost:8000/food/{food_id}/image"
    }

# Get the image of a food item
@app.get("/food/{food_id}/image", tags=["Food Management"])
def get_food_image(food_id: int, db: Session = Depends(get_db)):
    food_item = db.query(models.Food).filter(models.Food.id == food_id).first()
    if not food_item or not food_item.image:
        raise HTTPException(status_code=404, detail="Image not found")
    return StreamingResponse(BytesIO(food_item.image), media_type="image/png")

# Update Food Item
@app.put("/food/{food_id}/", tags=["Food Management"])
async def update_food(
    food_id: int,
    food: schemas.FoodCreate = Depends(),
    image: UploadFile = File(None),  # Image is optional for update
    db: Session = Depends(get_db)
):
    food_item = db.query(models.Food).filter(models.Food.id == food_id).first()
    if not food_item:
        raise HTTPException(status_code=404, detail="Food item not found")
    
    food_item.name = food.name
    food_item.price = food.price
    food_item.description = food.description
    food_item.category = food.category
    
    if image:
        image_data = await image.read()
        food_item.image = image_data

    db.commit()
    db.refresh(food_item)

    return {"detail": "Food item updated successfully", "food_id": food_item.id}


# Delete Food Item
@app.delete("/food/{food_id}/", tags=["Food Management"])
def delete_food(food_id: int, db: Session = Depends(get_db)):
    food_item = db.query(models.Food).filter(models.Food.id == food_id).first()
    if not food_item:
        raise HTTPException(status_code=404, detail="Food item not found")

    db.delete(food_item)
    db.commit()

    return {"detail": "Food item deleted successfully"}


# ==================
# Order Management
# ==================
@app.post("/add_to_cart/", tags=["Order Management"])
def order_food(order_food_item: schemas.Order, db: Session = Depends(get_db)):
    # Check if the user exists
    get_user_name = db.query(models.User).filter(models.User.user_name == order_food_item.user_name).first()
    if get_user_name is None:
        return {"detail": "Please do the registration first"}
    
    # Check if the food item exists
    food_item = db.query(models.Food).filter(models.Food.id == order_food_item.food_id).first()
    if food_item is None:
        return {"detail": "Food item not found"}
    
    # Check if there's an incomplete order for the user
    existing_order = db.query(models.Order).filter(
        models.Order.user_name == order_food_item.user_name,
        models.Order.complete == "0"  # Incomplete order
    ).first()

    if existing_order:
        # Use the existing order_id and pin
        if existing_order.food_id == order_food_item.food_id:
            # Update the existing order for the same food
            existing_order.quantity += order_food_item.quantity
            existing_order.price += order_food_item.quantity * food_item.price
            db.commit()
            db.refresh(existing_order)
            return {"detail": "Order updated", "order": existing_order}
        else:
            # Add a new food item under the same order_id and pin
            total_price = order_food_item.quantity * food_item.price
            new_order = models.Order(
                order_id=existing_order.order_id,  # Reuse existing order_id
                user_name=order_food_item.user_name,
                food_id=order_food_item.food_id,
                quantity=order_food_item.quantity,
                price=total_price,
                address=order_food_item.address,
                pin=existing_order.pin,  # Reuse existing pin
                complete="0"
            )
            db.add(new_order)
            db.commit()
            db.refresh(new_order)
            return {"detail": "Order added to existing incomplete order", "order": new_order}
    else:
        # Generate a new order_id and pin for completed orders or no previous orders
        pin = str(random.randint(10000, 99999))
        order_id = str(random.randint(1000, 9999))
        total_price = order_food_item.quantity * food_item.price

        new_order = models.Order(
            order_id=order_id,
            user_name=order_food_item.user_name,
            food_id=order_food_item.food_id,
            quantity=order_food_item.quantity,
            price=total_price,
            address=order_food_item.address,
            pin=pin,
            complete="0"
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        return {"detail": "New order created", "order": new_order}


@app.get("/generate_bill/{user_name}", tags=["Order Management"])
def generate_bill(user_name: str, db: Session = Depends(get_db)):
    # Fetch all incomplete orders for the user
    incomplete_orders = db.query(models.Order).filter(
        models.Order.user_name == user_name,
        models.Order.complete == "0"
    ).all()

    if not incomplete_orders:
        raise HTTPException(status_code=404, detail="No pending orders found for this user.")

    # Calculate total bill amount
    total_amount = sum(order.price for order in incomplete_orders)

    # Prepare bill details
    bill_details = {
        "user_name": user_name,
        "order_id": incomplete_orders[0].order_id,  # All should have the same order_id
        "items": [
            {
                "food_id": order.food_id,
                "quantity": order.quantity,
                "price": order.price,
                "address": order.address,
                "pin": order.pin,
            }
            for order in incomplete_orders
        ],
        "total_amount": total_amount,
    }

    return {"detail": "Bill generated successfully", "bill": bill_details}


@app.post("/cart_checkout/{order_id}/{pin}", tags=["Order Management"])
def checkout(order_id: str, pin: int, db: Session = Depends(get_db)):
    cart_items = db.query(models.Order).filter(models.Order.order_id == order_id, models.Order.pin == pin, models.Order.complete == "0").all()
    if not cart_items:
        raise HTTPException(status_code=404, detail="Cart is empty or order_id not found")

    # Mark all items in the cart as complete
    for item in cart_items:
        item.complete = "1"
    db.commit()

    return {"message": "Order successfully checked out", "order_id": order_id}


def send_otp(email, otp):
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()

    from_mail = 'justtest280@gmail.com'
    server.login(from_mail, 'bigd fnsb norh byzj')
    to_mail = email

    msg = EmailMessage()
    msg['Subject'] = "OTP verification"
    msg['From'] = from_mail
    msg['TO'] = to_mail

    msg.set_content("Your OTP is: " + otp)

    server.send_message(msg)    