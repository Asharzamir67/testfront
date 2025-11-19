from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.admin_schema import AdminCreate, AdminLogin
from controllers.admin_controller import register_admin, login_admin
from utils.dependencies import get_db, get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.post("/register")
def register(admin: AdminCreate, db: Session = Depends(get_db)):
    return register_admin(admin, db)

@router.post("/login")
def login(admin: AdminLogin, db: Session = Depends(get_db)):
    token = login_admin(admin, db)
    if not token:
        return {"error": "Invalid credentials"}
    return token

# Example admin-protected route
@router.get("/dashboard")
def dashboard(current_admin=Depends(get_current_admin)):
    return {"message": f"Welcome {current_admin.username} to admin dashboard!"}
