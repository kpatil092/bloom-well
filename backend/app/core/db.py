from flask_sqlalchemy import SQLAlchemy

from pymongo import MongoClient
from app.core.config import Config

db = SQLAlchemy()

class PyMongoClient:
  def __init__(self):
    self.client = None
    self.db = None
    self.app = None
    
  def init_app(self, app):
    self.app = app
    uri = app.config.get("MONGO_URI", Config.MONGO_URI)
    db_name = app.config.get("DB_NAME", Config.DB_NAME)
    self.client  = MongoClient(Config.MONGO_URI)
    self.db = self.client[Config.DB_NAME]
    
  def close(self):
    if self.client:
      self.client.close()
      
      
mongo_client = PyMongoClient()
mongo_db = mongo_client.db if mongo_client.db else None 