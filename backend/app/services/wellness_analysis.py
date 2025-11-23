import pandas as pd

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
        if subset[a].std() == 0 or subset[b].std() == 0:
            continue

        corr_val = subset[a].corr(subset[b])
        if pd.isna(corr_val):
            continue
        correlations[f"{a}__{b}"] = {
            "value": round(float(corr_val), 3),
            "n": len(subset),
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