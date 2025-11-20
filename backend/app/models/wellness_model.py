from pydantic import BaseModel, Field, EmailStr
from datetime import datetime

from app.core.db import db

DEFAULTS = {
  "sleepHours": 8, 
  "sleepQuality": 5, 
  "mood": 5, 
  "stress": 1, 
  "energy": 5, 
  "activeMinutes": 60, 
  "stepsCount": 5000, 
  "water": 7, 
  "weight": 60,  
  "height": 1.75, 
  "calories": 2000,
  "protein": 50,
  "carbs": 300,
  "fats": 50
}

ALLOWED_FIELDS = set(DEFAULTS.keys())

# class WellnessMetrics(BaseModel):
#   sleepHours: float = Field(ge=0, le=24, default=8) 
#   sleepQuality: int = Field(ge=1, le=5, default=4) 
#   mood: int = Field(ge=1, le=5, default=4) 
#   stress: int = Field(ge=1, le=5, default=1) 
#   energy: int = Field(ge=1, le=5, default=4) 
#   activeMinutes: float = Field(ge=0, default=45) 
#   stepsCount: float = Field(ge=0, default=5000) 
#   water: float = Field(ge=0, default=7.5) 
#   weight: Optional[float] = None 
#   height: Optional[float] = None
  
  
class WellnessMetrics(db.Model):
  __tablename__ = "wellness_metrics"
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
  date = db.Column(db.Date, nullable=False, index=True)
  sleep_hours = db.Column(db.Float, nullable=False, default=DEFAULTS["sleepHours"]) 
  sleep_quality = db.Column(db.Integer, nullable=False, default=DEFAULTS["sleepQuality"])
  mood = db.Column(db.Integer, nullable=False, default=DEFAULTS["mood"])
  stress = db.Column(db.Integer, nullable=False, default=DEFAULTS["stress"]) 
  energy = db.Column(db.Integer, nullable=False, default=DEFAULTS["energy"]) 
  active_minutes = db.Column(db.Float, nullable=False, default=DEFAULTS["activeMinutes"]) 
  steps_count = db.Column(db.Float, nullable=False, default=DEFAULTS["stepsCount"]) 
  water = db.Column(db.Float, nullable=False, default=DEFAULTS["water"]) 
  weight = db.Column(db.Float, nullable=True)
  height = db.Column(db.Float, nullable=True)
  calories = db.Column(db.Float, nullable=True, default=DEFAULTS["calories"])
  protein = db.Column(db.Float, nullable=True, default=DEFAULTS["protein"])
  carbs = db.Column(db.Float, nullable=True, default=DEFAULTS["carbs"])
  fats = db.Column(db.Float, nullable=True, default=DEFAULTS["fats"])
  source = db.Column(db.String(10), nullable=False, default="user")
  created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
  updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
  
  __table_args__ = (db.UniqueConstraint("user_id", "date", name="wellness_metrics_unique"),)
  
  def get_metric_vals(self):
    return {
      "sleepHours": self.sleep_hours,
      "sleepQuality": self.sleep_quality,
      "mood": self.mood,
      "stress": self.stress,
      "energy": self.energy,
      "activeMinutes": self.active_minutes,
      "stepsCount": self.steps_count,
      "water": self.water,
      "weight": self.weight,
      "height": self.height,
      "calories": self.calories,
      "protein": self.protein,
      "carbs": self.carbs,
      "fats": self.fats
    }
    
  @staticmethod
  def fill_metric_vals(user_id, date, metrics, source):
    new_metrics = DEFAULTS.copy()
    new_metrics.update(metrics or {})
    
    return WellnessMetrics(
      user_id=user_id,
      date=date,
      source=source,
      sleep_hours=new_metrics["sleepHours"],
      sleep_quality=new_metrics["sleepQuality"],
      mood=new_metrics["mood"],
      stress=new_metrics["stress"],
      energy=new_metrics["energy"],
      active_minutes=new_metrics["activeMinutes"],
      steps_count=new_metrics["stepsCount"],
      water=new_metrics["water"],
      weight=new_metrics["weight"],
      height=new_metrics["height"],
      calories=new_metrics["calories"],
      protein=new_metrics["protein"],
      carbs=new_metrics["carbs"],
      fats=new_metrics["fats"],
    )