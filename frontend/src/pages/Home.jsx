import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const LandingFacts = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
    <div className="card">
      <h3 className="font-semibold">Daily Steps</h3>
      <p className="small-muted mt-2">
        Walking 7,000–10,000 steps/day is linked to better cardiovascular
        health.
      </p>
    </div>
    <div className="card">
      <h3 className="font-semibold">Nutrition</h3>
      <p className="small-muted mt-2">
        Balanced macros, hydration and protein distribution aid recovery and
        energy.
      </p>
    </div>
    <div className="card">
      <h3 className="font-semibold">Sleep</h3>
      <p className="small-muted mt-2">
        7–9 hours of quality sleep improves mood and cognitive performance.
      </p>
    </div>
  </div>
);

const Home = () => {
  const user = useSelector((s) => s.auth.user);
  // const user = {
  //   name: "Alice",
  //   email: "alice@example.com",
  //   id: "123",
  // };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Take control of your health</h1>
          <p className="small-muted mt-2 max-w-xl">
            Plan meals, track steps and monitor wellbeing — all in one place.
          </p>
          {!user ? (
            <div className="mt-6 flex gap-3">
              <Link to="/signup" className="btn-primary">
                Get started
              </Link>
              <Link to="/login" className="btn-secondary">
                Sign in
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link to="/dashboard" className="card text-center">
                Dashboard
              </Link>
              <Link to="/nutritions" className="card text-center">
                Nutritional Intake
              </Link>
              <Link to="/timetable" className="card text-center">
                Timetable
              </Link>
              <Link to="/wellbeing" className="card text-center">
                Wellbeing
              </Link>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/3">
          <div className="card">
            <h4 className="font-semibold">Quick stats</h4>
            <p className="mt-3 small-muted">
              Static example UI — real values will come after integration with
              backend.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="p-3 bg-[var(--primary)] rounded-lg text-white">
                Steps
                <br />
                <strong>6,800</strong>
              </div>
              <div className="p-3 bg-[var(--secondary)] rounded-lg">
                Calories
                <br />
                <strong>1,800</strong>
              </div>
              <div className="p-3 bg-[var(--cta)] rounded-lg">
                Protein
                <br />
                <strong>95g</strong>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                Weight
                <br />
                <strong>72kg</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LandingFacts />
    </div>
  );
};

export default Home;
