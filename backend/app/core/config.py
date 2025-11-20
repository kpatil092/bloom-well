import os
from datetime import timedelta

class Config:
  SQLALCHEMY_DATABASE_URI = os.getenv("DB_URL")
  SQLALCHEMY_TRACK_MODIFICATIONS = False
  MONGO_URI = os.getenv('MONGO_URI')
  DB_NAME = os.getenv('DB_NAME', "Bloomwell")
  JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
  access_tokens_expiry = os.getenv('JWT_ACCESS_EXPIRES', 3600)
  refresh_tokens_expiry = os.getenv('JWT_REFRESH_EXPIRES', 24*3600)
  JWT_ACCESS_EXPIRES = timedelta(seconds=int(access_tokens_expiry))
  JWT_REFRESH_EXPIRES = timedelta(seconds=int(refresh_tokens_expiry))