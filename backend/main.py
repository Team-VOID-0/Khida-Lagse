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
    allow_headers=["*"],
)


models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/user_registration/", status_code=status.HTTP_201_CREATED, tags=["User Management"])
def create_user(requested_user: schemas.UserBase, db: Session = Depends(get_db)):
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
                               mobile_number = requested_user.mobile_number, 
                               email = requested_user.email,
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
    

@app.get("/verify_otp/{email}/{otp}", tags=["OTP"])
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
    

@app.get("/resend_otp/{email}", tags=["OTP"])
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


@app.post("/user_login/", tags=["User Management"])
def login(login_user: schemas.CheckUser, db: Session = Depends(get_db)):
    get_user_name = db.query(models.User).filter(models.User.user_name == login_user.user_name).first()
    if get_user_name is None:
        return {"detail": "Please do the registration first"}
    else:
        # hashed_user_id = bcrypt.hashpw(get_user_name.user_id.encode(), get_user_name.salt.encode())
        hashed_user_id = bcrypt.hashpw(get_user_name.user_id.encode(), get_user_name.salt if isinstance(get_user_name.salt, bytes) else get_user_name.salt.encode())
        result_set = db.query(models.Login).filter(models.Login.user_id == hashed_user_id).first() 
        if bcrypt.checkpw(get_user_name.user_id.encode(), result_set.user_id):       
            if get_user_name.is_active == "1":  
                hashed_password = result_set.password
                if bcrypt.checkpw(login_user.password.encode(), hashed_password):
                    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
                    access_token = create_access_token(
                    data={"sub": login_user.user_name}, expires_delta=access_token_expires
                    )
                    return schemas.Token(access_token=access_token, token_type="bearer")
                else:
                    return {"detail": "invalid username or password"}
            else:
                return {"detail": "Activate your account by using OTP"}  
            

@app.post("/forget_password/", tags=["Password"])
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
    

@app.post("/delete_user_account/", tags=["User Management"])
def user_delete(delete_user: schemas.UserDelete, db: Session = Depends(get_db)):
    check_user_name = db.query(models.User).filter(models.User.user_name == delete_user.user_name).first()
    if check_user_name is None:
        return {"detail": "Something went wrong"}
    else:
        # hashed_user_id = bcrypt.hashpw(check_user_name.user_id.encode(), check_user_name.salt.encode())
        hashed_user_id = bcrypt.hashpw(check_user_name.user_id.encode(), check_user_name.salt if isinstance(check_user_name.salt, bytes) else check_user_name.salt.encode())
        db.query(models.Login).filter(models.Login.user_id == hashed_user_id).delete()
        db.query(models.User).filter(models.User.user_name == delete_user.user_name).delete()
        db.query(models.OTP).filter(models.OTP.email == check_user_name.email).delete()
        db.commit()
        return {"detail": "Account deleted"}
    


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
            "image_url": f"/food/{food.id}/image"
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
        "image_url": f"/food/{food_id}/image"
    }

# Get the image of a food item
@app.get("/food/{food_id}/image", tags=["Food Management"])
def get_food_image(food_id: int, db: Session = Depends(get_db)):
    food_item = db.query(models.Food).filter(models.Food.id == food_id).first()
    if not food_item or not food_item.image:
        raise HTTPException(status_code=404, detail="Image not found")

    return StreamingResponse(BytesIO(food_item.image), media_type="image/png")


    
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