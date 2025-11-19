from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class ImageProcessRequest(BaseModel):
    model: str  # Model name (string) passed by client
