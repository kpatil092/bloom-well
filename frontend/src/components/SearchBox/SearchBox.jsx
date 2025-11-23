import React, { useState } from 'react';
import { searchFood } from '../../services/nutrition';
import FoodCard from '../FoodCard/FoodCard';

const SearchBox = ({ onAddToMeal }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a food name');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);
    
    try {
      const nutritionData = await searchFood(query);
      
      if (nutritionData.error) {
        setError(nutritionData.error);
      } else {
        setResults(nutritionData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToMeal = (mealData) => {
    onAddToMeal(mealData);
    setResults(null);
  };

  return (
    <div>
      
      <form onSubmit={handleSearch} className="flex sm:flex-row items-center justify-center gap-4 bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl mx-auto mt-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter food name (e.g., apple, chicken breast)"
          className="flex-1 w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow transition-all duration-200 ease-in-out cursor-pointer">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 text-red-700 bg-red-100 border border-red-300 rounded-xl px-5 py-3 mt-4 w-full max-w-3xl mx-auto">
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}

      {results && !results.error && (
        <FoodCard 
          foodData={results} 
          onAddToMeal={handleAddToMeal}
        />
      )}
    </div>
  );
};

export default SearchBox;