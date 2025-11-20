from datetime import datetime, timezone, timedelta
from bson import ObjectId
from pymongo import ReturnDocument, ASCENDING
from flask_jwt_extended import get_jwt_identity
from zoneinfo import ZoneInfo
    
from app.core.db import mongo_client
from app.models.wellness_model import DEFAULTS, ALLOWED_FIELDS
from app.utils.wellness_utils import backfill_missing_days_for_user

IST = ZoneInfo("Asia/Kolkata")

def get_today_controller():
  db = mongo_client.db
  user_id = ObjectId(get_jwt_identity())

  backfill_missing_days_for_user(user_id)

  doc = db.wellness_metrics.find_one({
    "userId": user_id, 
    "date": datetime.now(IST).date().isoformat()
    })

  if not doc:
    return {
      "date": datetime.now(IST).date().isoformat(),
      "metrics": DEFAULTS,
      "source": "none",
      "exists": False
    }, 200

  return {
    "date": doc["date"],
    "metrics": doc["metrics"],
    "source": doc.get("source", "user"),
    "exists": True,
    "updatedAt": doc.get("updatedAt"),
  }, 200


def upsert_today_controller(payload):
  db = mongo_client.db
  user_id = ObjectId(get_jwt_identity())

  backfill_missing_days_for_user(user_id)

  welness_collection = db.wellness_metrics

  payload = payload or {} 
  metrics = {k: v for k, v in payload.items() if k in ALLOWED_FIELDS}

  welness_collection.update_one(
    {"userId": user_id, "date": datetime.now(IST).date().isoformat()},
    {
      "$setOnInsert": {
        "userId": user_id,
        "date": datetime.now(IST).date().isoformat(),
        "metrics": DEFAULTS.copy(),
        "source": "user",
        "createdAt": datetime.now(timezone.utc),
      }
    },
    upsert=True,
  )

  updated = welness_collection.find_one_and_update(
    {"userId": user_id, "date": datetime.now(IST).date().isoformat()},
    {
      "$set": {
        "metrics": metrics,
        "source": "user",
        "updatedAt": datetime.now(timezone.utc),
      }
    },
    return_document=ReturnDocument.AFTER,
  )

  return {
      "date": updated["date"],
      "metrics": updated["metrics"],
      "source": updated.get("source", "user"),
      "updatedAt": updated.get("updatedAt"),
  }, 200

def get_by_date_controller(date_str):
  db = mongo_client.db
  user_id = ObjectId(get_jwt_identity())

  backfill_missing_days_for_user(user_id)

  doc = db.wellness_metrics.find_one({"userId": user_id, "date": date_str})
  if not doc:
    return {"date": date_str, "metrics": None, "exists": False}, 200

  return {
    "date": doc["date"],
    "metrics": doc["metrics"],
    "exists": True,
    "source": doc.get("source", "user"),
    "updatedAt": doc.get("updatedAt"),
  }, 200

def get_range_controller(start, end):
  db = mongo_client.db
  user_id = ObjectId(get_jwt_identity())

  backfill_missing_days_for_user(user_id)

  cursor = db.wellness_metrics.find({
    "userId": user_id,
    "date": {"$gte": start, "$lte": end}
  }).sort("date", ASCENDING)

  results = [{
    "date": d["date"],
    "metrics": d["metrics"],
    "source": d.get("source", "user"),
    "updatedAt": d.get("updatedAt"),
  } for d in cursor]

  return results, 200

def get_yesterday_controller():
  db = mongo_client.db
  user_id = ObjectId(get_jwt_identity())

  backfill_missing_days_for_user(user_id)
  yesterday_str = (datetime.now(IST).date() - timedelta(days=1)).isoformat()

  doc = db.wellness_metrics.find_one({"userId": user_id, "date": yesterday_str})
  if not doc:
    return {
      "date": yesterday_str,
      "metrics": DEFAULTS.copy(),
      "source": "none",
      "exists": False
    }, 200

  return {
    "date": doc["date"],
    "metrics": doc["metrics"],
    "source": doc.get("source", "user"),
    "exists": True,
    "updatedAt": doc.get("updatedAt"),
  }, 200
