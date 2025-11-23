import React from "react";
import Swal from "sweetalert2";

const TodayMeals = ({ meals, onDeleteMeal }) => {
  const mealTypes = [
    { key: "breakfast", label: "Breakfast", color: "#ffeb3b" },
    { key: "lunch", label: "Lunch", color: "#4caf50" },
    { key: "dinner", label: "Dinner", color: "#2196f3" },
  ];

  const calculateMealTotals = (mealItems) => {
    return mealItems.reduce(
      (totals, item) => ({
        calories: totals.calories + (item.totalCalories || 0),
        protein: totals.protein + (item.totalProtein || 0),
        carbs: totals.carbs + (item.totalCarbs || 0),
        fat: totals.fat + (item.totalFat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const handleConfirmDelete = (mealId, mealType) => {
  Swal.fire({
    title: "Delete this meal?",
    text: "You won’t be able to undo this action!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      onDeleteMeal(mealId, mealType);
    }
  });
};

  const dailyTotals = calculateMealTotals([
    ...(meals.breakfast || []),
    ...(meals.lunch || []),
    ...(meals.dinner || []),
  ]);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Today's Meals</h2>

      {/* Daily Total Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl mx-auto mb-10">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Today's Total</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-xl p-4 text-center shadow-sm">
            <span className="block text-gray-500 text-sm">Total Calories:</span>
            <span className="block text-xl font-semibold text-green-700">{dailyTotals.calories.toFixed(1)}</span>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center shadow-sm">
            <span className="block text-gray-500 text-sm">Protein:</span>
            <span className="block text-xl font-semibold text-green-700">{dailyTotals.protein.toFixed(1)}g</span>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center shadow-sm">
            <span className="block text-gray-500 text-sm">Carbohydrates:</span>
            <span className="block text-xl font-semibold text-green-700">{dailyTotals.carbs.toFixed(1)}g</span>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center shadow-sm">
            <span className="block text-gray-500 text-sm">Fat:</span>
            <span className="block text-xl font-semibold text-green-700">{dailyTotals.fat.toFixed(1)}g</span>
          </div>
        </div>
      </div>

      {/* Individual Meal Sections */}
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {mealTypes.map((mealType) => (
          <div key={mealType.key} className="bg-white shadow-md rounded-2xl p-6">
            <div
              className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4"
            >
              <h3 className="text-xl font-semibold text-gray-800">{mealType.label}</h3>
              <span className="text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded-full">
                {(meals[mealType.key] || []).length} items
              </span>
            </div>

            <div className="space-y-6">
              {(meals[mealType.key] || []).length === 0 ? (
                <div className="text-center bg-green-50 border border-green-200 rounded-xl py-6 text-green-800 font-medium shadow-sm">No food has been selected</div>
              ) : (
                <>
                  {meals[mealType.key].map((item, index) => (
                    <div key={index} className="bg-green-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-semibold text-gray-800 mr-3">{item.name}</span>
                        <span className="text-gray-600">
                          {item.quantity}x ({item.weight})
                        </span>
                        
                        <button className="text-red-600 font-semibold hover:text-red-600 transition cursor-pointer border border-red-200 rounded-xl px-2 bg-red-100" onClick={() => handleConfirmDelete(item._id, mealType.key)}>
                          Delete
                        </button>

                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                        <span>Calories: {item.totalCalories.toFixed(1)}</span>
                        <span>Protein: {item.totalProtein.toFixed(1)}g</span>
                        <span>Carbs: {item.totalCarbs.toFixed(1)}g</span>
                        <span>Fat: {item.totalFat.toFixed(1)}g</span>
                      </div>
                    </div>
                  ))}

                  {/* Totals per meal type */}
                  <div className="bg-green-100 rounded-xl p-4 mt-4">
                    <div className="font-semibold text-green-800 mb-2">
                      {mealType.label} Total:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-700">
                      <div >
                        <span className="font-medium">Calories:</span>
                        <span>
                          {calculateMealTotals(meals[mealType.key]).calories.toFixed(1)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Protein:</span>
                        <span>
                          {calculateMealTotals(meals[mealType.key]).protein.toFixed(1)}g
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Carbs:</span>
                        <span>
                          {calculateMealTotals(meals[mealType.key]).carbs.toFixed(1)}g
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Fat:</span>
                        <span>
                          {calculateMealTotals(meals[mealType.key]).fat.toFixed(1)}g
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
};

export default TodayMeals;
