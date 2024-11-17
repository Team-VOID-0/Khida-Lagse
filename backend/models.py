from sqlalchemy import Column, Integer, String, LargeBinary
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
    __tablename__ = "user_login"
   
    id = Column(Integer, primary_key=True, index=True)
    password = Column(LargeBinary)
    user_id = Column(LargeBinary)


class OTP(Base):
    __tablename__ = "user_otp"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(320), unique=True)
    otp = Column(String(10))








    



