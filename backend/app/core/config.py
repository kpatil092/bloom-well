import os
from datetime import timedelta

class Config:
  MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/Bloomwell')
  DB_NAME = os.getenv('DB_NAME', 'Bloomwell')
  JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
  access_tokens_expiry = os.getenv('JWT_ACCESS_EXPIRES', 3600)
  refresh_tokens_expiry = os.getenv('JWT_REFRESH_EXPIRES', 24*3600)
  JWT_ACCESS_EXPIRES = timedelta(seconds=int(access_tokens_expiry))
  JWT_REFRESH_EXPIRES = timedelta(seconds=int(refresh_tokens_expiry))