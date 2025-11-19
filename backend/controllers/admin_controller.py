from sqlalchemy.orm import Session
from passlib.context import CryptContext 
from models.admin import Admin
from utils.jwt_handler import create_access_token

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def register_admin(admin, db: Session):
    hashed_pw = pwd_context.hash(admin.password)
    db_admin = Admin(username=admin.username, password=hashed_pw)
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

def login_admin(admin, db: Session):
    db_admin = db.query(Admin).filter(Admin.username == admin.username).first()
    if not db_admin:
        return None
    if not pwd_context.verify(admin.password, db_admin.password):
        return None
    token = create_access_token({"admin_id": db_admin.id})
    return {"access_token": token, "token_type": "bearer"}
