from beanie import Document
from pydantic import EmailStr, Field
from datetime import datetime

class User(Document):
    name: str
    email: EmailStr
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
