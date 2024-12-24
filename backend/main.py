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
    # print(requested_user) 
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
                                         user_id = hashed_login_id,
                                         role = "user")
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
def login(user_name: str, password: str, db: Session = Depends(get_db)):
    # Retrieve the user and their role
    get_user_name = db.query(models.User).filter(models.User.user_name == user_name).first()
    if get_user_name is None:
        return {"detail": "Please do the registration first"}
    
    hashed_user_id = bcrypt.hashpw(
        get_user_name.user_id.encode(),
        get_user_name.salt if isinstance(get_user_name.salt, bytes) else get_user_name.salt.encode()
    )
    result_set = db.query(models.Login).filter(models.Login.user_id == hashed_user_id).first()
    
    if result_set is None:
        return {"detail": "Login record not found"}

    # Verify user ID matches and user is active
    if bcrypt.checkpw(get_user_name.user_id.encode(), result_set.user_id):       
        if get_user_name.is_active == "1":  
            # Verify password
            if bcrypt.checkpw(password.encode(), result_set.password):
                access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
                # Include the role in the token payload
                access_token = create_access_token(
                    data={
                        "sub": user_name,
                        "role": result_set.role,
                        "name": get_user_name.name,
                        "email": get_user_name.email,
                        "mobile": get_user_name.mobile_number
                    },
                    expires_delta=access_token_expires
                )
                return schemas.Token(access_token=access_token, token_type="bearer")
            else:
                return {"detail": "Invalid username or password"}
        else:
            return {"detail": "Activate your account by using OTP"}
    else:
        return {"detail": "Invalid username or password"}




@app.put("/user_update/", tags=["User Management"])
def update_user(update_data: schemas.UserUpdate, db: Session = Depends(get_db)):
    # Find the user by user_name
    user = db.query(models.User).filter(models.User.user_name == update_data.user_name).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update fields if provided
    if update_data.name:
        user.name = update_data.name
    if update_data.email:
        existing_email = db.query(models.User).filter(models.User.email == update_data.email).first()
        if existing_email and existing_email.user_name != update_data.user_name:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = update_data.email
    if update_data.mobile_number:
        existing_mobile = db.query(models.User).filter(models.User.mobile_number == update_data.mobile_number).first()
        if existing_mobile and existing_mobile.user_name != update_data.user_name:
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


@app.get("/get_all_users/", tags=["User Management"])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()  # Fetch all users from the User table
    result = []
    for user in users:
        # Retrieve the hashed user ID
        hashed_user_id = bcrypt.hashpw(user.user_id.encode(), user.salt if isinstance(user.salt, bytes) else user.salt.encode())
        # Fetch the login record using the hashed user ID
        login_record = db.query(models.Login).filter(models.Login.user_id == hashed_user_id).first()
        user_info = {
            "user_id": user.user_id,
            "name": user.name,
            "user_name": user.user_name,
            "email": user.email,
            "mobile_number": user.mobile_number,
            "is_active": user.is_active,
            "role": login_record.role if login_record else None
        }
        result.append(user_info)
    
    return result

 
    
    
# ==================
# User Management
# ==================

@app.post("/change_role/", tags=["User Management"])
def change_role(data: dict, db: Session = Depends(get_db)):
    user_name = data.get("user_name")
    new_role = data.get("new_role")

    # Retrieve the user by user_name
    user = db.query(models.User).filter(models.User.user_name == user_name).first()
    
    if user is None:
        return {"detail": "User does not exist"}
    
    # Get the associated login record using user_id
    hashed_user_id = bcrypt.hashpw(user.user_id.encode(), user.salt if isinstance(user.salt, bytes) else user.salt.encode())
    login_record = db.query(models.Login).filter(models.Login.user_id == hashed_user_id).first()
    
    if login_record is None:
        return {"detail": "Login record not found for the user"}
    
    # Update the role in the login table
    login_record.role = new_role
    db.commit()
    db.refresh(login_record)
    
    return {"detail": f"Role updated to '{new_role}' for user '{user_name}'"}


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
    


@app.post("/change_password/", tags=["Password Management"])
def change_password(data: schemas.ChangePasswordRequest, db: Session = Depends(get_db)):
    user_name = data.user_name
    new_password = data.new_password

    # Validate input
    if not user_name or not new_password:
        raise HTTPException(status_code=400, detail="Username and new password are required")
    
    # Find the user by user_name
    user = db.query(models.User).filter(models.User.user_name == user_name).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Find the associated login record using the hashed user_id
    hashed_user_id = bcrypt.hashpw(
        user.user_id.encode(), 
        user.salt if isinstance(user.salt, bytes) else user.salt.encode()  # Ensure salt is in bytes format
    )
    login_record = db.query(models.Login).filter(models.Login.user_id == hashed_user_id).first()
    
    if not login_record:
        raise HTTPException(status_code=404, detail="Login record not found")

    # Hash the new password with the existing salt
    hashed_password = bcrypt.hashpw(new_password.encode(), user.salt)

    # Update the password in the login record
    login_record.password = hashed_password
    db.commit()
    db.refresh(login_record)
    
    return {"detail": "Password updated successfully"}



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
    # image: UploadFile = File(None), 
    db: Session = Depends(get_db)
):
    food_item = db.query(models.Food).filter(models.Food.id == food_id).first()
    if not food_item:
        raise HTTPException(status_code=404, detail="Food item not found")
    
    food_item.name = food.name
    food_item.price = food.price
    food_item.description = food.description
    food_item.category = food.category
    
    # if image:
    #     image_data = await image.read()
    #     food_item.image = image_data

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
# @app.post("/add_to_cart/", tags=["Order Management"])
# def order_food(order_food_item: schemas.Order, db: Session = Depends(get_db)):
#     # Check if the user exists
#     get_user_name = db.query(models.User).filter(models.User.user_name == order_food_item.user_name).first()
#     if get_user_name is None:
#         return {"detail": "Please do the registration first"}
    
#     # Check if the food item exists
#     food_item = db.query(models.Food).filter(models.Food.id == order_food_item.food_id).first()
#     if food_item is None:
#         return {"detail": "Food item not found"}
    
#     # Check if there's an incomplete order for the user
#     existing_order = db.query(models.Order).filter(
#         models.Order.user_name == order_food_item.user_name,
#         models.Order.complete == "0"  # Incomplete order
#     ).first()

#     if existing_order:
#         # Use the existing order_id and pin
#         if existing_order.food_id == order_food_item.food_id:
#             # Update the existing order for the same food
#             existing_order.quantity += order_food_item.quantity
#             existing_order.price += order_food_item.quantity * food_item.price
#             db.commit()
#             db.refresh(existing_order)
#             return {"detail": "Order updated", "order": existing_order}
#         else:
#             # Add a new food item under the same order_id and pin
#             total_price = order_food_item.quantity * food_item.price
#             new_order = models.Order(
#                 order_id=existing_order.order_id,  # Reuse existing order_id
#                 user_name=order_food_item.user_name,
#                 food_id=order_food_item.food_id,
#                 quantity=order_food_item.quantity,
#                 price=total_price,
#                 address=order_food_item.address,
#                 pin=existing_order.pin,  # Reuse existing pin
#                 complete="0"
#             )
#             db.add(new_order)
#             db.commit()
#             db.refresh(new_order)
#             return {"detail": "Order added to existing incomplete order", "order": new_order}
#     else:
#         # Generate a new order_id and pin for completed orders or no previous orders
#         pin = str(random.randint(10000, 99999))
#         order_id = str(random.randint(1000, 9999))
#         total_price = order_food_item.quantity * food_item.price

#         new_order = models.Order(
#             order_id=order_id,
#             user_name=order_food_item.user_name,
#             food_id=order_food_item.food_id,
#             quantity=order_food_item.quantity,
#             price=total_price,
#             address=order_food_item.address,
#             pin=pin,
#             complete="0",
#         )
#         db.add(new_order)
#         db.commit()
#         db.refresh(new_order)
#         return {"detail": "New order created", "order": new_order}




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
            complete="0",
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)

        # Send the PIN and order details to the user's email
        send_pin(get_user_name.email, pin, order_id, food_item.name, order_food_item.quantity, total_price, order_food_item.address)

        return {"detail": "New order created", "order": new_order}


@app.get("/all_orders/", tags=["Order Management"])
def show_all_orders(db: Session = Depends(get_db)):
    # Fetch all orders with their assigned delivery man's username
    all_orders = db.query(models.Order).all()

    # Prepare the response
    orders_list = []
    for order in all_orders:
        # Fetch the delivery man's username
        deliveryman_user = db.query(models.User).filter(
            models.User.user_id == order.assigned_deliveryman
        ).first()
        if deliveryman_user:
            deliveryman_user_name = deliveryman_user.user_name
        else:
            deliveryman_user_name = None  # or you can set a default message or value

        orders_list.append({
            "order_id": order.order_id,
            "user_name": order.user_name,
            "food_id": order.food_id,
            "quantity": order.quantity,
            "price": order.price,
            "address": order.address,
            "pin": order.pin,
            "assigned_deliveryman": order.assigned_deliveryman,
            "assigned_deliveryman_user_name": deliveryman_user_name,
            "complete": order.complete,
            "date": order.date
        })

    return {"detail": "All orders retrieved successfully", "orders": orders_list}

@app.get("/order_details/{order_id}", tags=["Order Management"])
def get_order_details(order_id: str, db: Session = Depends(get_db)):
    # Fetch the order by order_id
    order = db.query(models.Order).filter(models.Order.order_id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Fetch the associated user and food item details
    user = db.query(models.User).filter(models.User.user_name == order.user_name).first()
    food_item = db.query(models.Food).filter(models.Food.id == order.food_id).first()

    if not user or not food_item:
        raise HTTPException(status_code=404, detail="User or Food item not found")

    # Prepare order details
    order_details = {
        "order_id": order.order_id,
        "user_name": order.user_name,
        "food_id": order.food_id,
        "food_name": food_item.name,
        "quantity": order.quantity,
        "price": order.price,
        "address": order.address,
        "pin": order.pin,
        "assigned_deliveryman": order.assigned_deliveryman,
        "complete": order.complete,
        "date": order.date
    }

    return {"detail": "Order details retrieved successfully", "order": order_details}



@app.delete("/delete_order/{order_id}", tags=["Order Management"])
def delete_order(order_id: str, db: Session = Depends(get_db)):
    # Fetch the order
    order = db.query(models.Order).filter(models.Order.order_id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Delete the order
    db.delete(order)
    db.commit()

    return {"message": "Order deleted successfully"}



@app.post("/assign_deliveryman/", tags=["DeliveryMan Management"])
def assign_deliveryman(details: schemas.AssignDeliveryman, db: Session = Depends(get_db)):
    # Fetch the order
    order = db.query(models.Order).filter(
        models.Order.order_id == details.order_id,
        models.Order.complete == "0"
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found or already completed")

    # Assign the deliveryman
    order.assigned_deliveryman = details.deliveryman_user_id
    db.commit()
    db.refresh(order)

    deliveryman_user = db.query(models.User).filter(
        models.User.id == details.deliveryman_user_id
    ).first()

    if not deliveryman_user:
        raise HTTPException(status_code=404, detail="Deliveryman not found")


    return {"message": "Deliveryman assigned successfully", "order": {
        "order_id": order.order_id,
        "assigned_deliveryman": deliveryman_user.user_name,
        "assigned_deliveryman_id": order.assigned_deliveryman,
        "user_name": order.user_name
    }}



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
    cart_items = db.query(models.Order).filter(
        models.Order.order_id == order_id,
        models.Order.pin == pin,
        models.Order.complete == "0"
    ).all()
    
    if not cart_items:
        raise HTTPException(status_code=404, detail="Cart is empty or order_id not found")

    # Fetch the user's email and food details
    user_name = cart_items[0].user_name  # All items have the same user_name for the order
    user = db.query(models.User).filter(models.User.user_name == user_name).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Collect food details for email
    delivered_items = []
    for item in cart_items:
        food_item = db.query(models.Food).filter(models.Food.id == item.food_id).first()
        delivered_items.append({
            "food_name": food_item.name,
            "quantity": item.quantity
        })
        item.complete = "1"  # Mark item as complete
    
    db.commit()

    # Send delivery confirmation email
    send_delivery_confirmation(user.email, order_id, delivered_items)

    return {"message": "Order successfully checked out and delivery email sent", "order_id": order_id}

# ==================
# Delivery Management
# ==================
@app.get("/all_deliverymen/", tags=["DeliveryMan Management"])
def get_all_deliverymen(db: Session = Depends(get_db)):
    deliverymen = []
    users = db.query(models.User).all()
    for user in users:
        hashed_user_id = bcrypt.hashpw(
            user.user_id.encode(),
            user.salt if isinstance(user.salt, bytes) else user.salt.encode()
        )
        login_record = db.query(models.Login).filter(models.Login.user_id == hashed_user_id).first()
        if login_record and login_record.role == "delivery":
            deliverymen.append({
                "user_id": user.user_id,
                "name": user.name,
                "user_name": user.user_name,
                "email": user.email,
                "mobile_number": user.mobile_number,
                "is_active": user.is_active
            })
    
    if not deliverymen:
        return {"detail": "No deliverymen found"}
    
    return {"deliverymen": deliverymen}


@app.get("/assigned_orders/{user_name}", tags=["DeliveryMan Management"])
def show_assigned_orders(user_name: str, db: Session = Depends(get_db)):
    # Fetch the user by user_name
    user = db.query(models.User).filter(models.User.user_name == user_name).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch all orders assigned to this user_id
    assigned_orders = db.query(models.Order).filter(models.Order.assigned_deliveryman == user.user_id).all()

    if not assigned_orders:
        return {"detail": "No assigned orders found for this user"}

    # Prepare the response
    orders_list = []
    for order in assigned_orders:
        orders_list.append({
            "order_id": order.order_id,
            "user_name": order.user_name,
            "food_id": order.food_id,
            "quantity": order.quantity,
            "price": order.price,
            "address": order.address,
            "pin": order.pin,
            "complete": order.complete,
            "date": order.date
        })

    return {"detail": "Assigned orders retrieved successfully", "orders": orders_list}

@app.get("/user_orders/{user_name}", tags=["Order Management"])
def get_user_orders(user_name: str, db: Session = Depends(get_db)):
    # Fetch the user's orders based on the user_name
    user_orders = db.query(models.Order).filter(models.Order.user_name == user_name).all()

    if not user_orders:
        raise HTTPException(status_code=404, detail="No orders found for this user")

    # Prepare the response
    orders_list = []
    for order in user_orders:
        # Fetch the associated food item details
        food_item = db.query(models.Food).filter(models.Food.id == order.food_id).first()
        if not food_item:
            raise HTTPException(status_code=404, detail="Food item not found for order")

        orders_list.append({
            "order_id": order.order_id,
            "food_name": food_item.name,
            "quantity": order.quantity,
            "price": order.price,
            "address": order.address,
            "pin": order.pin,
            "complete": order.complete,
            "date": order.date
        })

    return {"detail": "User's orders retrieved successfully", "orders": orders_list}


@app.get("/count_statistics/", tags=["Statistics"])
def count_statistics(db: Session = Depends(get_db)):
    # Count total users
    total_users = db.query(models.User).count()

    # Count total food items
    total_food_items = db.query(models.Food).count()

    # Count total orders
    total_orders = db.query(models.Order).count()

    # Calculate total price of all orders
    total_price = sum(order.price for order in db.query(models.Order).all())

    return {
        "total_users": total_users,
        "total_food_items": total_food_items,
        "total_orders": total_orders,
        "total_price": total_price
    }



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


def send_pin(email, pin, order_id, food_name, quantity, total, address):
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()

    from_mail = 'justtest280@gmail.com'
    server.login(from_mail, 'bigd fnsb norh byzj')
    to_mail = email

    msg = EmailMessage()
    msg['Subject'] = "Order Confirmation"
    msg['From'] = from_mail
    msg['To'] = to_mail

    msg.set_content(f"Your order has been placed successfully!\n\n"
                    f"Order ID: {order_id}\n"
                    f"Food Item: {food_name}\n"
                    f"Quantity: {quantity}\n"
                    f"Total: {total}৳\n"
                    f"Address: {address}\n"
                    f"Pin: {pin}\n\n"
                    f"Please use this PIN to confirm your order upon delivery.")

    server.send_message(msg)
    server.quit()


def send_delivery_confirmation(email, order_id, items):
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()

    from_mail = 'justtest280@gmail.com'
    server.login(from_mail, 'bigd fnsb norh byzj')
    to_mail = email

    msg = EmailMessage()
    msg['Subject'] = "Order Delivered Successfully"
    msg['From'] = from_mail
    msg['To'] = to_mail

    # Create the body of the email
    email_body = f"Your order with Order ID: {order_id} has been successfully delivered.\n\n"
    email_body += "Items Delivered:\n"

    for item in items:
        email_body += f"- {item['food_name']} x {item['quantity']}\n"

    email_body += "\nThank you for ordering with us!\n\nBest regards,\nThe Team"

    msg.set_content(email_body)
    server.send_message(msg)





@app.put("/update_food_price/{food_id}", tags=["Food Management"])
def update_food_price(food_id: int, new_price: float, db: Session = Depends(get_db)):
    # Fetch the food item
    food_item = db.query(models.Food).filter(models.Food.id == food_id).first()

    if not food_item:
        raise HTTPException(status_code=404, detail="Food item not found")

    # Update the food item's price
    food_item.price = new_price

    # Commit the change to the database
    db.commit()
    db.refresh(food_item)

    return {"detail": "Food price updated successfully", "food": {
        "id": food_item.id,
        "name": food_item.name,
        "new_price": food_item.price
    }}
