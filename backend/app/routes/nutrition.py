from flask import Blueprint, request, jsonify
from app.services.scraper_service import NutritionScraper
from app.core.db import mongo_client

nutrition_bp = Blueprint('nutrition', __name__)


@nutrition_bp.route('/search', methods=['POST'])
def search_nutrition():
    try:
        foods_collection = mongo_client.get_collection("foods")
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        food_name = data.get('food', '').strip()
        if not food_name:
            return jsonify({'error': 'Food name is required'}), 400

        print(f"Received search request for: {food_name}")

       
        existing = foods_collection.find_one({'name': food_name.lower()})
        if existing:
            existing['_id'] = str(existing['_id']) 
            print("Found in MongoDB cache.")
            if "name" in existing and isinstance(existing["name"], str):
                existing["name"] = existing["name"].title()
            return jsonify(existing)

       
        nutrition_data = NutritionScraper.search_food(food_name)

        if 'error' not in nutrition_data:
            
            inserted = foods_collection.insert_one({
                **nutrition_data,
                "name": food_name.lower()
            })
            nutrition_data['_id'] = str(inserted.inserted_id)

        return jsonify(nutrition_data)

    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
