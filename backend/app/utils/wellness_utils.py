from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo
from app.core.db import db
from app.models.wellness_model import DEFAULTS, WellnessMetrics

IST = ZoneInfo("Asia/Kolkata")

def backfill_missing_days(user_id):
  
  yesterday = datetime.now(IST).date() - timedelta(days=1)

  last_doc = (
    WellnessMetrics.query
    .filter_by(user_id=user_id)
    .order_by(WellnessMetrics.date.desc())
    .first()
  )

  if not last_doc:
    yesterday_data = WellnessMetrics.query.filter_by(user_id=user_id, date=yesterday).first()
    
    if not yesterday_data:
      record = WellnessMetrics.fill_metric_vals(
        user_id=user_id,
        date=yesterday,
        metrics=DEFAULTS,
        source="auto"
      )
      record.created_at = datetime.now(timezone.utc)
      record.updated_at = datetime.now(timezone.utc)
      
      db.session.add(record)
      db.session.commit()
      
    return
      
  last_date = last_doc.date
  next_date = last_date + timedelta(days=1)
  if next_date > yesterday:
    return  

  first_entry = last_doc.get_metric_vals()

  curr = next_date
  while curr <= yesterday:
    record = WellnessMetrics.fill_metric_vals(
      user_id=user_id,
      date=curr,
      metrics=first_entry,
      source="auto"
    )
    record.created_at = datetime.now(timezone.utc)
    record.updated_at = datetime.now(timezone.utc)
    db.session.add(record)
    curr = curr + timedelta(days=1)
    
  db.session.commit()