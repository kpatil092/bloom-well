from pydantic import BaseModel, Field, EmailStr

class UserModel(BaseModel):
  username: str = Field(..., min_length=2, max_length=12)
  email: EmailStr = Field(...)
  password: str = Field(..., min_length=6, max_length=20)
  