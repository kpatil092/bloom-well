from flask import Blueprint, request, jsonify
from app.controllers.auth_controllers import login_controller, signup_controller

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
