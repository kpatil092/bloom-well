import React, { useState } from "react";

const MEAL_DATA = [
  { name: "Grilled Chicken", calories: 200, protein: 30, carbs: 0, fat: 5 },
  { name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: "Egg Omelette", calories: 180, protein: 12, carbs: 2, fat: 14 },
  { name: "Salad", calories: 80, protein: 3, carbs: 12, fat: 2 },
];

const Nutritions = () => {
  const [searchMeal, setSearchMeal] = useState("");
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [waterIntake, setWaterIntake] = useState(1); // liters

  const filteredMeals = MEAL_DATA.filter((meal) =>
    meal.name.toLowerCase().includes(searchMeal.toLowerCase())
  );

  const addMeal = (meal) => {
    setSelectedMeals([...selectedMeals, meal]);
  };

  const totalCalories = selectedMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = selectedMeals.reduce((sum, m) => sum + m.protein, 0);

  return (
    <div className="space-y-8">
      {/* Meal Tracker */}
      <div className="card">
        <h2 className="text-xl font-semibold">Meal Tracker</h2>
        <input
          type="text"
          placeholder="Search meal..."
          className="mt-3 p-2 border rounded-lg w-full"
          value={searchMeal}
          onChange={(e) => setSearchMeal(e.target.value)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {filteredMeals.map((meal) => (
            <div
              key={meal.name}
              className="p-3 border rounded-lg flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold">{meal.name}</h4>
                <p className="small-muted text-sm">
                  {meal.calories} cal, {meal.protein}g protein
                </p>
              </div>
              <button className="btn-primary" onClick={() => addMeal(meal)}>
                Add
              </button>
            </div>
          ))}
        </div>

        {selectedMeals.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold">Today's Meals</h3>
            <ul className="mt-2 space-y-1">
              {selectedMeals.map((meal, idx) => (
                <li key={idx} className="flex justify-between border-b py-1">
                  <span>{meal.name}</span>
                  <span>{meal.calories} cal</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between font-semibold">
              <span>Total Calories:</span> <span>{totalCalories}</span>
            </div>
            <div className="mt-1 flex justify-between font-semibold">
              <span>Total Protein:</span> <span>{totalProtein}g</span>
            </div>
          </div>
        )}
      </div>

      {/* Water Intake */}
      <div className="card">
        <h2 className="text-xl font-semibold">Water Intake</h2>
        <div className="mt-4 flex items-center gap-4">
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={waterIntake}
            onChange={(e) => setWaterIntake(Number(e.target.value))}
            className="p-2 border rounded-lg w-20"
          />
          <span>Liters</span>
        </div>
        <div className="mt-3 text-sm small-muted">
          Recommended daily intake: 2–3 liters.
        </div>
      </div>
    </div>
  );
};

export default Nutritions;
