from flask import Flask, jsonify
from dotenv import load_dotenv
import os

from app.core.db import db, mongo_client
from app.core.security import jwt, api, cors
from app.core.config import Config
from app.routes.auth_routes import bp_auth
from app.routes.wellness_routes import bp_wellness

def create_app():
  load_dotenv()
  app = Flask(__name__)
  app.config.from_object(Config)
  app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_URL")
  
  db.init_app(app)
  mongo_client.init_app(app)
  jwt.init_app(app)
  # api.init_app(app)
  cors.init_app(app, resources={r"/api/*": {"origins": "http://localhost:5173"}},
        supports_credentials=True, allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "OPTIONS"])
  
  # print("Auth routes imported")
  app.register_blueprint(bp_auth, url_prefix="/api/auth")  #working 
  app.register_blueprint(bp_wellness, url_prefix="/api/wellness")
  
  @app.get("/")
  def index():
    return jsonify({"msg": "Backend running"})
  
  with app.app_context():
    from app.models.user_model import User
    from app.models.wellness_model import WellnessMetrics
    db.create_all()
  
  return app

if __name__ == "__main__":
  app = create_app()
  app.run(debug=True)
