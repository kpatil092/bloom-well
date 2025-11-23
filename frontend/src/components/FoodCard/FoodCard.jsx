import React, { useState } from 'react';
import { addMeal } from '../../services/nutrition';

const FoodCard = ({ foodData, onAddToMeal }) => {
  const [mealType, setMealType] = useState('breakfast');
  const [quantity, setQuantity] = useState(1);
  const [weightInput, setWeightInput] = useState('');

  const portionSizeGrams = (() => {
    const match = foodData.portion_size?.match(/(\d+(\.\d+)?)\s*g/);
    return match ? parseFloat(match[1]) : 100;
  })();

  const calculatedWeight = quantity * portionSizeGrams;
  const calculatedQuantity = weightInput
    ? (parseFloat(weightInput) / portionSizeGrams).toFixed(2)
    : quantity.toFixed(2);

  const handleQuantityChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
      setWeightInput(''); 
    }
  };

  const handleWeightChange = (e) => {
    const value = e.target.value;
    setWeightInput(value);

    const weightValue = parseFloat(value);
    if (!isNaN(weightValue) && weightValue > 0) {
       const qty = weightValue / portionSizeGrams;
       setQuantity(Number(qty.toFixed(3))); 
    }
  };

  const handleAddToMeal = async () => {
    const mealData = {
      ...foodData,
      mealType,
      quantity,
      weight: `${calculatedWeight.toFixed(2)}g`,
      totalCalories: (parseFloat(foodData.calories) || 0) * quantity,
      totalProtein: (parseFloat(foodData.protein) || 0) * quantity,
      totalCarbs: (parseFloat(foodData.total_carbohydrate) || 0) * quantity,
      totalFat: (parseFloat(foodData.total_fat) || 0) * quantity,
    };

    onAddToMeal(mealData);

    try {
      await addMeal(mealType, mealData);
      console.log('Added to MongoDB successfully');
    } catch (err) {
      console.error('Failed to add meal:', err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl mx-auto border border-gray-100 transition-all hover:shadow-xl mt-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">{foodData.name}</h3>
        <div className="text-sm text-gray-500 mt-1">
          Portion: {foodData.portion_size}
        </div>
      </div>

      {/* Nutrition Info */}
      <div className="grid grid-cols-2 gap-4 bg-gray-100 rounded-xl p-4 mb-5">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Calories:</span>
          <span className="font-semibold text-gray-800">{foodData.calories}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Protein:</span>
          <span className="font-semibold text-gray-800">{foodData.protein}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Carbs:</span>
          <span className="font-semibold text-gray-800">{foodData.total_carbohydrate}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Fat:</span>
          <span className="font-semibold text-gray-800">{foodData.total_fat}</span>
        </div>
      </div>

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6 w-full max-w-3xl mx-auto mt-6">
        {/* Meal Type */}
        <div className="flex flex-col w-full sm:w-1/3">
          <label className="font-semibold text-gray-700 mb-2">Meal Type:</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>

        {/* Quantity */}
        <div className="flex flex-col w-full sm:w-1/3">
          <label className="font-semibold text-gray-700 mb-2">Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="0.1"
            step="0.1"
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <div className="text-sm text-gray-500 mt-1">
            Weight: {calculatedWeight.toFixed(2)}g
          </div>
        </div>

        {/* Weight */}
        <div className="flex flex-col w-full sm:w-1/3">
          <label className="font-semibold text-gray-700 mb-2">Weight (g):</label>
          <input
            type="number"
            value={weightInput}
            onChange={handleWeightChange}
            placeholder="Enter weight"
            className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <div className="text-sm text-gray-500 mt-1">
            Quantity: {calculatedQuantity}
          </div>
        </div>
      </div>

      <button
        onClick={handleAddToMeal}
        className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl shadow transition-all duration-200 ease-in-out cursor-pointer"
      >
        Add to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
      </button>
    </div>
  );
};

export default FoodCard;
