import axiosClient from "./api";

export const searchFood = async (foodName) => {
  try {
    const response = await axiosClient.post("/search", {
      food: foodName,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Search failed");
  }
};


export const addMeal = async (mealType, food) => {
  try {
    const response = await axiosClient.post("/meals/add", {
      mealType,
      food,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Add meal failed");
  }
};


export const getTodaysMeals = async () => {
  try {
    const res = await axiosClient.get("/meals/today");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch today's meals:", err.response || err);
    throw new Error("Failed to fetch today's meals");
  }
};


export const deleteMeal = async (mealId, mealType) => {
  try {
    const res = await axiosClient.post("/meals/delete", {
      _id: mealId,
      mealType,
    });
    return res.data;
  } catch (err) {
    console.error("Error deleting meal:", err.response || err);
    throw err;
  }
};
