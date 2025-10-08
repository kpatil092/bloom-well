import React, { useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Timetable = () => {
  const [schedule, setSchedule] = useState({});

  const addEvent = (day) => {
    const event = prompt("Add task or activity:");
    if (!event) return;
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day] ? [...prev[day], event] : [event],
    }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Weekly Schedule</h2>
      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day} className="card p-3 flex flex-col">
            <div className="font-semibold">{day}</div>
            <ul className="mt-2 flex flex-col gap-1">
              {schedule[day]?.map((task, idx) => (
                <li
                  key={idx}
                  className="p-1 bg-[var(--secondary)] rounded text-sm"
                >
                  {task}
                </li>
              ))}
            </ul>
            <button
              className="btn-primary mt-auto"
              onClick={() => addEvent(day)}
            >
              + Add
            </button>
          </div>
        ))}
      </div>
      <div className="small-muted mt-3">
        Click "+ Add" on any day to add your activity or meal.
      </div>
    </div>
  );
};

export default Timetable;
