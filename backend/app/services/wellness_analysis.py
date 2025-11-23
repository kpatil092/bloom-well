import pandas as pd
import numpy as np
from typing import List, Dict, Any
from app.models.wellness_model import WellnessMetrics

CORRELATION_PAIRS = [
    ("sleepHours", "mood"),
    ("sleepHours", "stress"),
    ("sleepHours", "energy"),
    ("activeMinutes", "mood"),
    ("stepsCount", "energy"),
    ("calories", "energy"),
]

def records_to_df(records):
    if not records:
        return pd.DataFrame()

    rows = []
    for rec in records:
        rows.append({
            "date": rec.date,
            **rec.get_metric_vals()
        })

    df = pd.DataFrame(rows)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date").set_index("date")

    for k in df.columns:
        df[k] = pd.to_numeric(df[k], errors="coerce")

    return df

def compute_correlations(df):
    correlations = {}
    for a, b in CORRELATION_PAIRS:
        if a not in df.columns or b not in df.columns:
            continue

        subset = df[[a, b]].dropna()
        if len(subset) < 5:
            continue

        value = float(subset[a].corr(subset[b]))
        correlations[f"{a}__{b}"] = {
            "value": round(value, 3),
            "n": len(subset)
        }

    return correlations


def strength(v):
    if abs(v) >= 0.65:
        return "strong"
    if abs(v) >= 0.4:
        return "moderate"
    return "weak"


def analyze_correlations(records):
    df = records_to_df(records)

    if df.empty:
        return {
            "hasData": False,
            "correlations": {},
            "insights": []
        }

    correlations = compute_correlations(df)
    return {
        "hasData": True,
        "correlations": correlations,

    }