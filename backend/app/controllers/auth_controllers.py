from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user_model import UserModel, User
from app.core.db import db
from app.utils.user_util import get_hashed_password, check_password
from app.core.config import Config
from bson import ObjectId
from app.utils.wellness_utils import backfill_missing_days

def signup_controller(data):
  try:
    user_ = UserModel(**data)
  except Exception as e:
    return {'message': str(e)}, 400

  if User.query.filter_by(email=user_.email).first(): 
    return {"message": "Email already exist"}, 400
  if User.query.filter_by(username=user_.username).first():
    return {"message": "Username already exist"}, 400
  
  hashed_password = get_hashed_password(user_.password)
  
  user = User(username=user_.username, email=user_.email, password=hashed_password)
  
  try:
    db.session.add(user)
    db.session.commit()
  except Exception as e:
    db.session.rollback()
    return {"message": str(e)}, 400
  
  return {
    'message': "User created", 
    "user": {"id": user.id, "username": user.username, "email": user.email}
    }, 201
  


def login_controller(data):
  
  username = data.get("username", "").strip()
  password = data.get("password", "").strip()
  
  if not username or not password:
    return {'message': "Username and password are required"}, 400
  
  user = User.query.filter_by(username=username).first()
  
  if not user:
    return {'message': "Invalid Credential"}, 401

  
  if not (check_password(user.password, password)):
    return {'message': "Invalid Credential"}, 401
  
  user_id = str(user.id)
  
  try:
    backfill_missing_days(user_id)
  except:     pass
  access_token = create_access_token(
    identity=user_id, 
    fresh=True, 
    expires_delta=Config.JWT_ACCESS_EXPIRES
    )
  
  data = user.get_user_vals()
  
  return {
    'message': "Login successful", 
    "token": access_token,
    "user": data
    }, 200
  
@jwt_required()
def get_user_controller(data):
  
  user_id_str = get_jwt_identity()
  
  try:
    user_id = int(user_id_str)
  except Exception:
    return {"message": "Invalid token"}, 401
  
  user = User.query.get(user_id)
  if not user:
    return {'message': 'User not found'}, 401
  
  try:
    backfill_missing_days(user_id)
  except Exception as e: pass  

  
  return {
    'message': "", 
    "user": user.get_user_vals()
    }, 200
  
@jwt_required()
def update_user_controller(data):
  
  user_id_str = get_jwt_identity()
  
  try:
    user_id = int(user_id_str)
  except Exception:
    return {"message": "Invalid token identity"}, 401
  
  user = User.query.get(user_id)
  if not user:
    return {'message': 'User not found'}, 404
  
  for k, v in data.items():
    if k in ("dob", "name", "gender", "goal"):
      setattr(user, k, v)
      
  try:
    db.session.commit()
  except Exception:
    db.session.rollback()
    return {"message": "Something went wrong"}, 500
  
  return {
    'message': "User updated successfully", 
    "user": user.get_user_vals()
    }, 200