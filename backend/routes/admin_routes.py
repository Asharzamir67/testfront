from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.admin_schema import AdminCreate, AdminLogin
from controllers.admin_controller import register_admin, login_admin
from utils.dependencies import get_db, get_current_admin
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/register")
def register(admin: AdminCreate, db: Session = Depends(get_db)):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n[{timestamp}] 🟣 ADMIN REGISTER REQUEST")
    print(f"  Username: {admin.username}")
    try:
        result = register_admin(admin, db)
        print(f"  ✅ Registration successful - Admin ID: {result.id}")
        return result
    except Exception as e:
        print(f"  ❌ Registration failed: {str(e)}")
        raise

@router.post("/login")
def login(admin: AdminLogin, db: Session = Depends(get_db)):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n[{timestamp}] 🟡 ADMIN LOGIN REQUEST")
    print(f"  Username: {admin.username}")
    token = login_admin(admin, db)
    if not token:
        print(f"  ❌ Login failed - Invalid credentials")
        return {"error": "Invalid credentials"}
    print(f"  ✅ Login successful - Token generated")
    return token

# Example admin-protected route
@router.get("/dashboard")
def dashboard(current_admin=Depends(get_current_admin)):
    return {"message": f"Welcome {current_admin.username} to admin dashboard!"}
