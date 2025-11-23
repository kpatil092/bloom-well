from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, date
from app.core.db import mongo_client
from app.models.wellness_model import WellnessMetrics
from app.core.db import db

meal_bp = Blueprint("meal", __name__)

def update_sql_from_todays_meals(user_id):
    
    response, status = get_todays_meals()
    if status != 200:
        print("Could not fetch today's meals")
        return None

    meals_data = response.get_json()

    totals = meals_data.get("totals", {})
    total_cal = totals.get("calories", 0)
    total_pro = totals.get("protein", 0)
    total_carb = totals.get("carbs", 0)
    total_fat = totals.get("fat", 0)

    today = datetime.now().date()

    metric = WellnessMetrics.query.filter_by(
        user_id=user_id,
        date=today
    ).first()

    if not metric:
        print("Wellness record not found for today")
        return None

    metric.calories = total_cal
    metric.protein = total_pro
    metric.carbs = total_carb
    metric.fats = total_fat
    db.session.commit()

    print("SQL wellness_metrics updated")

    return totals


@meal_bp.route("/meals/add", methods=["POST"])
@jwt_required()
def add_meal():
    try:
        data = request.get_json()
        meal_type = data.get("mealType")
        food = data.get("food")

        if not meal_type or not food:
            return jsonify({"error": "Missing mealType or food"}), 400
        
        if "name" in food and isinstance(food["name"], str):
            food["name"] = food["name"].title()

        user_id = str(get_jwt_identity())   

        meals_collection = mongo_client.get_collection("meals")
        today = date.today().isoformat()

        meal_doc = meals_collection.find_one({
            "user_id": user_id,
            "date": today
        })

        food_totals = {
            "calories": food.get("totalCalories", 0),
            "protein": food.get("totalProtein", 0),
            "carbs": food.get("totalCarbs", 0),
            "fat": food.get("totalFat", 0),
        }

        if meal_doc:
            meals_collection.update_one(
                {"_id": meal_doc["_id"]},
                {
                    "$push": {f"meals.{meal_type}": food},
                    "$inc": {
                        "totals.calories": food_totals["calories"],
                        "totals.protein": food_totals["protein"],
                        "totals.carbs": food_totals["carbs"],
                        "totals.fat": food_totals["fat"],
                    }
                }
            )
        else:
            meals_collection.insert_one({
                "user_id": user_id,
                "date": today,
                "meals": {
                    "breakfast": [],
                    "lunch": [],
                    "dinner": [],
                    meal_type: [food],
                },
                "totals": food_totals,
            })

        update_sql_from_todays_meals(user_id)
        return jsonify({"message": "Meal added successfully"}), 200

    except Exception as e:
        print("ERROR ADDING MEAL:", e)
        return jsonify({"error": str(e)}), 500



@meal_bp.route("/meals/today", methods=["GET"])
@jwt_required()
def get_todays_meals():
    try:
        user_id = str(get_jwt_identity())  
        today = datetime.now().strftime("%Y-%m-%d")

        meals_collection = mongo_client.get_collection("meals")
        record = meals_collection.find_one({"user_id": user_id, "date": today})

        if not record:
            return jsonify({
                "user_id": user_id,
                "date": today,
                "meals": {
                    "breakfast": [],
                    "lunch": [],
                    "dinner": []
                },
                "totals": {
                    "calories": 0,
                    "protein": 0,
                    "carbs": 0,
                    "fat": 0
                }
            }), 200

        record["_id"] = str(record["_id"])

        return jsonify(record), 200

    except Exception as e:
        print("ERROR FETCHING MEALS:", e)
        return jsonify({"error": str(e)}), 500


@meal_bp.route("/meals/delete", methods=["POST"])
@jwt_required()
def delete_meal():
    try:
        data = request.get_json()
        meal_type = data.get("mealType")
        meal_id = data.get("_id")

        if not meal_type or not meal_id:
            return jsonify({"error": "Missing mealType or _id"}), 400

        user_id = str(get_jwt_identity())
        today = datetime.now().strftime("%Y-%m-%d")

        meals_collection = mongo_client.get_collection("meals")
        record = meals_collection.find_one({"user_id": user_id, "date": today})

        if not record:
            return jsonify({"error": "No meals found"}), 404

        record["meals"][meal_type] = [
            m for m in record["meals"][meal_type]
            if str(m.get("_id")) != meal_id
        ]

        totals = {"calories": 0, "protein": 0, "carbs": 0, "fat": 0}
        for mtype in ["breakfast", "lunch", "dinner"]:
            for item in record["meals"][mtype]:
                totals["calories"] += item.get("totalCalories", 0)
                totals["protein"] += item.get("totalProtein", 0)
                totals["carbs"] += item.get("totalCarbs", 0)
                totals["fat"] += item.get("totalFat", 0)

        meals_collection.update_one(
            {"_id": record["_id"]},
            {"$set": {"meals": record["meals"], "totals": totals}}
        )

        update_sql_from_todays_meals(user_id)

        return jsonify({
            "message": "Meal deleted successfully",
            "meals": record["meals"],
            "totals": totals
        }), 200

    except Exception as e:
        print("ERROR DELETE MEAL:", e)
        return jsonify({"error": str(e)}), 500
