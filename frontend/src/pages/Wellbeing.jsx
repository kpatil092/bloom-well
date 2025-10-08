import React from "react";

const WellBeing = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Wellbeing Tracker</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Mood Tracker */}
        <div className="card flex flex-col items-center p-4">
          <h3 className="font-semibold">Mood Tracker</h3>
          <select className="mt-3 p-2 border rounded-lg w-full">
            <option>😊 Happy</option>
            <option>😐 Neutral</option>
            <option>😔 Sad</option>
            <option>😡 Angry</option>
          </select>
          <p className="small-muted mt-2 text-center">Track your daily mood</p>
        </div>

        {/* Meditation */}
        <div className="card flex flex-col items-center p-4">
          <h3 className="font-semibold">Meditation</h3>
          <button className="btn-primary mt-3">Start Session</button>
          <p className="small-muted mt-2 text-center">
            5–20 min meditation for stress relief
          </p>
        </div>

        {/* Sleep Tracker */}
        <div className="card flex flex-col items-center p-4">
          <h3 className="font-semibold">Sleep Tracker</h3>
          <input
            type="number"
            placeholder="Hours slept"
            className="mt-3 p-2 border rounded-lg w-full text-center"
          />
          <p className="small-muted mt-2 text-center">
            Track nightly sleep duration
          </p>
        </div>

        {/* Gratitude / Notes */}
        <div className="card p-4 flex flex-col">
          <h3 className="font-semibold">Daily Reflection</h3>
          <textarea
            placeholder="Write something positive..."
            className="mt-3 p-2 border rounded-lg w-full resize-none"
            rows={4}
          ></textarea>
        </div>

        {/* Exercise / Mindfulness */}
        <div className="card p-4 flex flex-col">
          <h3 className="font-semibold">Mindfulness Activity</h3>
          <ul className="mt-2 list-disc list-inside small-muted">
            <li>Breathing exercise 3 min</li>
            <li>Stretching 5 min</li>
            <li>Walk outdoors 10 min</li>
          </ul>
        </div>

        {/* Placeholder card for charts */}
        <div className="card p-4 flex flex-col justify-center items-center">
          <h3 className="font-semibold">Progress Overview</h3>
          <p className="mt-3 small-muted">Visual charts will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default WellBeing;
