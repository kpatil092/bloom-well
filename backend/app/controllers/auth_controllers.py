from flask_jwt_extended import create_access_token
from app.models.user_model import UserModel
from app.core.db import mongo_client
from app.utils.user_util import get_hashed_password, check_password
from app.core.config import Config

def signup_controller(data):
  db = mongo_client.db
  try:
    user = UserModel(**data)
  except Exception as e:
    return {'message': str(e)}, 400

  if db.users.find_one({"email": user.email}):
    return {'message': "Email already exist"}, 400
  if db.users.find_one({"username": user.username}):
    return {'message': "Username already exist"}, 400
  
  hashed_password = get_hashed_password(user.password)
  
  user_dic = user.model_dump()
  user_dic['password'] = str(hashed_password)  
  
  db.users.insert_one(user_dic)
  return {
    'message': "User created", 
    "user": {"username": user_dic["username"], "email": user_dic["email"]}
    }, 201
  


def login_controller(data):
  db = mongo_client.db
  
  username = data.get("username", "").strip()
  password = data.get("password", "").strip()
  if not username or not password:
    return {'message': "Username and password are required"}, 400
  
  doc = db.users.find_one({"username": username})
  if not doc:
    return {'message': "Invalid Credential"}, 401

  
  if not (check_password(doc["password"], password)):
    return {'message': "Invalid Credential"}, 401
  
  access_token = create_access_token(
    identity=username, 
    fresh=True, 
    expires_delta=Config.JWT_ACCESS_EXPIRES
    )
  
  return {
    'message': "Login successful", 
    "access token": access_token,
    "user": {"username": username, "email": doc["email"]}
    }, 201