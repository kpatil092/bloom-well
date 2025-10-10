from pydantic import BaseModel, EmailStr
from typing import Optional
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

class User(BaseModel):
    id: Optional[PyObjectId] = None
    email: EmailStr
    username: str
    hashed_password: str

    class Config:
        json_encoders = {ObjectId: str}
        arbitrary_types_allowed = True
