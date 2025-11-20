from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.controllers.auth_controllers import (
  login_controller, signup_controller, 
  get_user_controller, update_user_controller
  )

bp_auth = Blueprint("auth", __name__)

@bp_auth.route('/signup', methods=['POST'])
def signup():
  response, status = signup_controller(request.json)
  return jsonify(response), status
  

@bp_auth.route('/login', methods=['POST'])
def login():
  response, status = login_controller(request.json)
  return jsonify(response), status

@bp_auth.route('/logout')
def logout():
  pass

@jwt_required()
@bp_auth.route('/current-user', methods=['POST', 'GET', 'OPTIONS'])
def get_user():
  if request.method == 'OPTIONS':
    return jsonify({"message": "CORS preflight"}), 200
  data = None
  if request.method == 'POST':
      data = request.get_json(silent=True)
  response, status = get_user_controller(data)
  return jsonify(response), status

@jwt_required()
@bp_auth.route('/update-user', methods=['POST', 'OPTIONS'])
def update_user():
  if request.method == 'OPTIONS':
    return jsonify({"message": "CORS preflight"}), 200
  data = None
  if request.method == 'POST':
      data = request.get_json(silent=True)
  response, status = update_user_controller(data)
  return jsonify(response), status