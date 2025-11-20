from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user_model import UserModel
from app.core.db import mongo_client
from app.utils.user_util import get_hashed_password, check_password
from app.core.config import Config
from bson import ObjectId
from app.utils.wellness_utils import backfill_missing_days_for_user

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
  
  user_id = str(doc["_id"])
  
  try:
    backfill_missing_days_for_user(ObjectId(user_id))
  except:
    pass
  access_token = create_access_token(
    identity=user_id, 
    fresh=True, 
    expires_delta=Config.JWT_ACCESS_EXPIRES
    )
  
  data = dict((k, v) for k, v in doc.items() if k not in ["_id", "password"])
  data["_id"] = user_id
  
  return {
    'message': "Login successful", 
    "token": access_token,
    "user": data
    }, 200
  
@jwt_required()
def get_user_controller(data):
  db = mongo_client.db
  
  user_id_str = get_jwt_identity()
  
  try:
    user_id = ObjectId(user_id_str)
  except Exception:
    return {"message": "Invalid token identity"}, 401
  
  doc = db.users.find_one({'_id': user_id}, {"password": 0})
  if not doc:
    return {'message': 'User not found'}, 401
  
  try:
    backfill_missing_days_for_user(user_id)
  except:
    pass  
  
  doc["_id"] = str(doc["_id"])
  
  return {
    'message': "", 
    "user": doc
    }, 200
  
@jwt_required()
def update_user_controller(data):
  db = mongo_client.db
  
  user_id_str = get_jwt_identity()
  
  try:
    user_id = ObjectId(user_id_str)
  except Exception:
    return {"message": "Invalid token identity"}, 401
  
  doc = db.users.find_one_and_update(
    {'_id': user_id}, {"$set": data}, {"password": 0}, 
    return_document=True
  )
  if not doc:
    return {'message': 'User not found'}, 404
  
  doc["_id"] = str(doc["_id"])
  
  return {
    'message': "User updated successfully", 
    "user": doc
    }, 200