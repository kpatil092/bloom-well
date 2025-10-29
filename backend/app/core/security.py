from flask_jwt_extended import JWTManager
from flask_smorest import Api
from flask_cors import CORS

jwt = JWTManager()
api = Api()
cors = CORS()