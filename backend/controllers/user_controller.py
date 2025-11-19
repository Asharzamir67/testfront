from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models.user import User
from utils.jwt_handler import create_access_token, verify_access_token


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def register_user(user, db: Session):
    hashed_pw = pwd_context.hash(user.password)
    db_user = User(username=user.username, password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    print(f"    → User created in database: ID={db_user.id}, Username={db_user.username}")
    return db_user

def login_user(user, db: Session):
    db_user = db.query(User).filter(User.username == user.username).first()
    
    if not db_user:
        print(f"    → User not found in database")
        return None
    
    print(f"    → User found: ID={db_user.id}")
    verified = pwd_context.verify(user.password, db_user.password)
    
    if not verified:
        print(f"    → Password verification failed")
        return None
    
    print(f"    → Password verified successfully")
    token = create_access_token({"user_id": db_user.id})
    return {"access_token": token, "token_type": "bearer"}
