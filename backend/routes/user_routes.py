from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.user_schema import UserCreate, UserLogin
from controllers.user_controller import register_user, login_user
from utils.dependencies import get_db
from datetime import datetime

router = APIRouter(prefix="/user", tags=["User"])

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n[{timestamp}] 🔵 USER REGISTER REQUEST")
    print(f"  Username: {user.username}")
    try:
        result = register_user(user, db)
        print(f"  ✅ Registration successful - User ID: {result.id}")
        return result
    except Exception as e:
        print(f"  ❌ Registration failed: {str(e)}")
        raise

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n[{timestamp}] 🟢 USER LOGIN REQUEST")
    print(f"  Username: {user.username}")
    token = login_user(user, db)
    if not token:
        print(f"  ❌ Login failed - Invalid credentials")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    print(f"  ✅ Login successful - Token generated")
    return token
