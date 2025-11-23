import React, { useEffect, useState } from "react";
import SearchBox from "../components/SearchBox/SearchBox";
import TodayMeals from "../components/TodayMeals/TodayMeals";
import { getTodaysMeals, deleteMeal } from "../services/nutrition";

const Nutrition = () => {
  const [todayMeals, setTodayMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    totals: { calories: 0, protein: 0, fat: 0, carbs: 0 },
  });

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const data = await getTodaysMeals();
        if (data && data.meals) {
          setTodayMeals(data.meals);
          console.log("Fetched today's meals:", data.meals);
        } else {
          console.warn("No meals found in response:", data);
        }
      } catch (err) {
        console.error("Failed to fetch today's meals:", err.message);
      }
    };
    fetchMeals();
  }, []);

  const addToMeal = (mealData) => {
    setTodayMeals((prev) => ({
      ...prev,
      [mealData.mealType]: [...(prev[mealData.mealType] || []), mealData],
    }));
  };

  const handleDeleteMeal = async (mealId, mealType) => {
    try {
      const res = await deleteMeal(mealId, mealType);
      if (res.meals) {
        setTodayMeals(res.meals);
        console.log("Meal deleted successfully:", res);
      } else {
        console.warn("Delete response missing meals:", res);
      }
    } catch (err) {
      console.error("Failed to delete meal:", err.message);
    }
  };

  return (
    <div className="nutrition-page">
      <div className="container">
        <div className="search-section">
          <SearchBox onAddToMeal={addToMeal} />
        </div>
        <div className="meals-section">
          <TodayMeals meals={todayMeals} onDeleteMeal={handleDeleteMeal} />
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
