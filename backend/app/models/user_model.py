from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from app.core.db import db

class UserModel(BaseModel):
  username: str = Field(..., min_length=2, max_length=12)
  email: EmailStr = Field(...)
  password: str = Field(..., min_length=6, max_length=255)
  
class User(db.Model):
  __tablename__ = "users"
  
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(12), nullable=False, unique=True, index=True)
  email = db.Column(db.String(50), nullable=False, unique=True, index=True)
  name = db.Column(db.String(50), nullable=True)
  gender = db.Column(db.String(10), nullable=True)
  dob = db.Column(db.Date, nullable=True)
  bio = db.Column(db.Text, nullable=True)
  password = db.Column(db.String(255), nullable=False)
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
  
  def get_user_vals(self) :
    return {
      "id": self.id,
      "username": self.username,
      "email": self.email,
      "name": self.name,
      "gender": self.gender,
      "dob": self.dob,
      "bio": self.bio,
      "created_at": self.created_at,
      "updated_at": self.updated_at
    } 
  