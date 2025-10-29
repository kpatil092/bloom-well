from flask import Flask, jsonify
from dotenv import load_dotenv
from app.core.db import mongo_client
from app.core.security import jwt, api, cors
from app.core.config import Config
from app.routes.auth_routes import bp_auth

def create_app():
  app = Flask(__name__)
  load_dotenv()
  app.config.from_object(Config)
  mongo_client.init_app(app)
  jwt.init_app(app)
  # api.init_app(app)
  cors.init_app(app)
  
  # print("Auth routes imported")
  app.register_blueprint(bp_auth, url_prefix="/api/auth")  #working 
  
  @app.get("/")
  def index():
    return jsonify({"msg": "Backend running"})
  
  return app

if __name__ == "__main__":
  app = create_app()
  app.run(debug=True)
