from datetime import datetime, timezone, timedelta
from flask_jwt_extended import get_jwt_identity
from zoneinfo import ZoneInfo
    
from app.core.db import db
from app.models.wellness_model import DEFAULTS, ALLOWED_FIELDS, WellnessMetrics
from app.utils.wellness_utils import backfill_missing_days
from app.services.wellness_analysis import analyze_correlations

IST = ZoneInfo("Asia/Kolkata")



def get_today_controller():
  user_id = int(get_jwt_identity())

  backfill_missing_days(user_id)

  metric = WellnessMetrics.query.filter_by(
    user_id= user_id, 
    date= datetime.now(IST).date()
    ).first()

  if not metric:
    return {
      "date": datetime.now(IST).date().isoformat(),
      "metrics": DEFAULTS,
      "source": "none",
      "exists": False
    }, 200

  return {
    "date": metric.date.isoformat(),
    "metrics": metric.get_metric_vals(),
    "source": metric.source or "user",
    "exists": True,
    "updatedAt": metric.updated_at.replace(tzinfo=timezone.utc).isoformat(),
  }, 200


def upsert_today_controller(payload):
  
  user_id = int(get_jwt_identity())

  backfill_missing_days(user_id)

  payload = payload or {} 
  metrics = {k: v for k, v in payload.items() if k in ALLOWED_FIELDS}

  metric = WellnessMetrics.query.filter_by(user_id=user_id, date=datetime.now(IST).date()).first()
  if not metric:
    metric = WellnessMetrics.fill_metric_vals( 
      user_id=user_id,
      date=datetime.now(IST).date(), 
      metrics=DEFAULTS, 
      source="user", 
    ) 
    db.session.add(metric) 
    db.session.flush()

  new_metric = metric.get_metric_vals() 
  new_metric.update(metrics) 
  
  metric.sleep_hours = new_metric["sleepHours"] 
  metric.sleep_quality = new_metric["sleepQuality"] 
  metric.mood = new_metric["mood"] 
  metric.stress = new_metric["stress"] 
  metric.energy = new_metric["energy"] 
  metric.active_minutes = new_metric["activeMinutes"] 
  metric.steps_count = new_metric["stepsCount"] 
  metric.water = new_metric["water"] 
  metric.weight = new_metric.get("weight") 
  metric.height = new_metric.get("height") 
  metric.calories = new_metric["calories"]
  metric.protein = new_metric["protein"]
  metric.carbs = new_metric["carbs"]
  metric.fats = new_metric["fats"]
  metric.source = "user" 
  metric.updated_at = datetime.now(timezone.utc) 
  
  db.session.commit()

  return { 
    "date": metric.date.isoformat(), 
    "metrics": metric.get_metric_vals(), 
    "source": metric.source or "user", 
    "updatedAt": metric.updated_at.replace(tzinfo=timezone.utc).isoformat()
  }, 200

def get_by_date_controller(date_str):
  user_id = int(get_jwt_identity())

  backfill_missing_days(user_id)

  try: 
    dt = datetime.strptime(date_str, "%Y-%m-%d").date() 
  except ValueError:
    return {"message": "Invalid date format"}, 400
  
  
  doc = WellnessMetrics.query.filter_by(user_id=user_id, date=dt).first()
  if not doc:
    return {"date": date_str, "metrics": None, "exists": False}, 200

  return {
    "date": doc.date.isoformat(), 
    "metrics": doc.get_metric_vals(), 
    "source": doc.source or "user", 
    "updatedAt": doc.updated_at.replace(tzinfo=timezone.utc).isoformat()
  }, 200

def get_range_controller(start, end):
  user_id = int(get_jwt_identity())

  backfill_missing_days(user_id)
  
  try:
    start_dt = datetime.strptime(start, "%Y-%m-%d").date()
    end_dt = datetime.strptime(end, "%Y-%m-%d").date()
  except ValueError:
    return {"message": "Invalid date format"}, 400
    

  data = WellnessMetrics.query.filter(
    WellnessMetrics.user_id == user_id,
    WellnessMetrics.date >= start_dt,
    WellnessMetrics.date <= end_dt
    ).order_by(WellnessMetrics.date.asc()).all()

  results = []
  
  for metric in data:
    results.append({
      "date": metric.date.isoformat(), 
      "metrics": metric.get_metric_vals(), 
      "source": metric.source or "user", 
      "updatedAt": metric.updated_at.replace(tzinfo=timezone.utc).isoformat()
    })

  analysis = analyze_correlations(data)  

  return {
        "raw": results,
        "analysis": analysis
    }, 200

def get_yesterday_controller():
  user_id = int(get_jwt_identity())

  backfill_missing_days(user_id)
  yesterday = (datetime.now(IST).date() - timedelta(days=1))

  doc = WellnessMetrics.query.filter_by(user_id=user_id, date=yesterday).first()
  
  if not doc:
    return {
      "date": yesterday.isoformat(),
      "metrics": DEFAULTS.copy(),
      "source": "none",
      "exists": False
    }, 200

  return {
    "date": doc.date.isoformat(), 
    "metrics": doc.get_metric_vals(), 
    "source": doc.source or "user", 
    "updatedAt": doc.updated_at.replace(tzinfo=timezone.utc).isoformat()
  }, 200
