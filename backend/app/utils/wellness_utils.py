from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo
from bson import ObjectId
from app.core.db import mongo_client
from app.models.wellness_model import DEFAULTS

IST = ZoneInfo("Asia/Kolkata")

def backfill_missing_days_for_user(user_id):
  db = mongo_client.db
  wellness_collection = db.wellness_metrics
  yesterday = datetime.now(IST).date() - timedelta(days=1)

  last_doc = wellness_collection.find_one(
    {"userId": user_id},
    sort=[("date", -1)],
    projection={"date": 1, "metrics": 1},
  )

  if not last_doc:
    yday_str = yesterday.strftime("%Y-%m-%d")
    exists = wellness_collection.find_one({"userId": user_id, "date": yday_str}, {"_id": 1})
    if not exists:
      try:
        wellness_collection.insert_one({
          "userId": user_id,
          "date": yday_str,
          "metrics": DEFAULTS.copy(),
          "source": "auto",
          "createdAt": datetime.now(timezone.utc),
          "updatedAt": datetime.now(timezone.utc),
        })
      except Exception: pass
    return

  last_date = datetime.strptime(last_doc["date"], "%Y-%m-%d").date()
  next_date = last_date + timedelta(days=1)
  if next_date > yesterday:
    return  

  base_metrics = last_doc.get("metrics", DEFAULTS.copy())

  docs = []
  while next_date <= yesterday:
    docs.append({
      "userId": user_id,
      "date": next_date.strftime("%Y-%m-%d"),
      "metrics": base_metrics.copy(),
      "source": "auto",
      "createdAt": datetime.now(timezone.utc),
      "updatedAt": datetime.now(timezone.utc),
    })
    next_date += timedelta(days=1)

  if docs:
    try:
      wellness_collection.insert_many(docs, ordered=False)
    except Exception: pass
