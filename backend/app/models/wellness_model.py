from pydantic import BaseModel, Field, EmailStr
from typing import Optional

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
}

ALLOWED_FIELDS = set(DEFAULTS.keys())

class WellnessMetrics(BaseModel):
  sleepHours: float = Field(ge=0, le=24, default=8) 
  sleepQuality: int = Field(ge=1, le=5, default=4) 
  mood: int = Field(ge=1, le=5, default=4) 
  stress: int = Field(ge=1, le=5, default=1) 
  energy: int = Field(ge=1, le=5, default=4) 
  activeMinutes: float = Field(ge=0, default=45) 
  stepsCount: float = Field(ge=0, default=5000) 
  water: float = Field(ge=0, default=7.5) 
  weight: Optional[float] = None 
  height: Optional[float] = None
  
  
def indexes(db):
  db.wellness.create_index([("userId", 1), ("date", 1)], unique=True)