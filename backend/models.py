from sqlalchemy import Column, Integer, Float, String, LargeBinary
from database import Base


class User(Base):
    __tablename__ = "user_registration"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    user_name = Column(String(255), unique=True)
    email = Column(String(320), unique=True)
    mobile_number = Column(String(15), unique=True)
    is_active = Column(String(5))
    user_id = Column(String(20))
    salt = Column(String(255))


class Login(Base):
    __tablename__ = "login"
   
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(LargeBinary)
    password = Column(LargeBinary)
    role = Column(String(255))


class OTP(Base):
    __tablename__ = "user_otp"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(320), unique=True)
    otp = Column(String(10))


class Food(Base):
    __tablename__ = 'foods'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    image = Column(LargeBinary, nullable=False)  # Store image as binary data
    price = Column(Float, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)


class Order(Base):
    __tablename__ = "Order"

    order_id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String(255), nullable=False)
    food_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Integer, nullable=False)
    address = Column(String(255), nullable=False)
