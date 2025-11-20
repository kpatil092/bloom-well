from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.controllers.wellness_controllers import (
  get_today_controller, upsert_today_controller,
  get_yesterday_controller,
  get_by_date_controller, get_range_controller,
)

bp_wellness = Blueprint("wellness", __name__)

@bp_wellness.route("/today", methods=["GET"])
@jwt_required()
def get_today():
  data, status = get_today_controller()
  return jsonify(data), status


@bp_wellness.route("/today", methods=["POST", "OPTIONS"])
@jwt_required()
def upsert_today():
  if request.method == "OPTIONS":
    return jsonify({"message": "CORS preflight"}), 200

  payload = request.get_json(silent=True) or {}
  data, status = upsert_today_controller(payload)
  return jsonify(data), status


@bp_wellness.route("/by-date", methods=["GET"])
@jwt_required()
def get_by_date():
  date_str = request.args.get("date")
  if not date_str:
    return jsonify({"error": "Missing date"}), 400

  data, status = get_by_date_controller(date_str)
  return jsonify(data), status


@bp_wellness.route("/range", methods=["GET"])
@jwt_required()
def get_range():
  start = request.args.get("start")
  end = request.args.get("end")

  if not start or not end:
    return jsonify({"error": "Missing range"}), 400

  data, status = get_range_controller(start, end)
  return jsonify(data), status


@bp_wellness.route("/yesterday", methods=["GET", "OPTIONS"])
@jwt_required()
def get_yesterday():
  if request.method == "OPTIONS":
    return jsonify({"message": "CORS preflight"}), 200
  resp, status = get_yesterday_controller()
  return jsonify(resp), status
