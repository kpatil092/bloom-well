import React from "react";

const StatCard = ({ title, value }) => (
  <div className="card text-center">
    <div className="text-sm small-muted">{title}</div>
    <div className="text-2xl font-bold mt-2">{value}</div>
  </div>
);

const Dashboard = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button className="btn-cta">Download PDF report</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
        <StatCard title="Steps" value="6,800" />
        <StatCard title="Calories" value="1,800" />
        <StatCard title="Protein" value="95g" />
        <StatCard title="Weight" value="72kg" />
        <StatCard title="Consistency" value="76%" />
        <StatCard title="Sleep" value="7.2h" />
      </div>

      <div className="mt-6 card">
        <h3 className="font-semibold">Activity (example graph)</h3>
        <div className="mt-4 small-muted">
          Placeholder for chart — integrate Recharts or Chart.js to draw
          real-time graphs here.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
