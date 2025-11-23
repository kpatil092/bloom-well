import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "../services/api";
import { ResponsiveContainer, LineChart,  Line, XAxis, YAxis, Tooltip,
  Legend, Area, ComposedChart, CartesianGrid , BarChart, Bar,
} from "recharts";

import { motion } from "framer-motion";

function isoDateNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

const OPTIONS = [
  { label: "7 Days", days: 7 },
  { label: "15 Days", days: 15 },
  { label: "30 Days", days: 30 },
];

const Label_dict = {
  "sleepHours": "Sleep Hours",
  "mood": "Mood",
  "stress": "Stress",
  "energy": "Energy",
  "activeMinutes": "Active Minutes",
  "stepsCount": "Steps Count",
  "calories": "Calories"
}

const ChartCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow p-4"
  >
    <h4 className="text-lg font-semibold mb-3">{title}</h4>
    <div style={{ width: "100%", height: 260 }}>{children}</div>
  </motion.div>
);

export default function Dashboard() {
  const [days, setDays] = useState(7);
  const [rawData, setRawData] = useState([]);
  const [correlations, setCorrelations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRange = async () => {
      setLoading(true);
      try {
        const start = isoDateNDaysAgo(days - 1);
        const end = new Date().toISOString().split("T")[0];

        const res = await axiosClient.get(`/wellness/range?start=${start}&end=${end}`);

        const raw = res.data.raw || [];
        const analysis = res.data.analysis?.correlations || {};

        setCorrelations(analysis);

        const converted = raw.map((item) => ({
          date: item.date,
          calories: item.metrics?.calories ?? 0,
          protein: item.metrics?.protein ?? 0,
          carbs: item.metrics?.carbs ?? 0,
          fats: item.metrics?.fats ?? 0,
          sleepHours: item.metrics?.sleepHours ?? 0,
          sleepQuality: item.metrics?.sleepQuality ?? 0,
          mood: item.metrics?.mood ?? 0,
          stress: item.metrics?.stress ?? 0,
          energy: item.metrics?.energy ?? 0,
          stepsCount: item.metrics?.stepsCount ?? 0,
          activeMinutes: item.metrics?.activeMinutes ?? 0,
          water: item.metrics?.water ?? 0,
          weight: item.metrics?.weight ?? 0,
          height: item.metrics?.height ?? 0,
        }));

        converted.sort((a, b) => new Date(a.date) - new Date(b.date));
        setRawData(converted);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      }
      setLoading(false);
    };

    fetchRange();
  }, [days]);

  // BMI
  const chartData = useMemo(() => {
    return rawData.map((r) => ({
      ...r,
      bmi:
        r.weight > 0 && r.height > 0
          ? Number((r.weight / (r.height * r.height)).toFixed(2))
          : null,
    }));
  }, [rawData]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-green-700">Wellness Dashboard</h1>
          <div className="flex gap-2">
            {OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => setDays(opt.days)}
                className={`px-4 py-2 rounded-xl font-semibold transition-shadow ${days === opt.days
                  ? "bg-green-600 text-white shadow"
                  : "bg-white text-gray-700 border"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </header>

        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}

        <h2 className="text-base font-semibold mb-3 text-green-700">Nutrients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Calories */}
          <ChartCard title="Daily Calories Intake">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="calories" stroke="#10B981" name="Calories" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Protein/Carbs/Fats */}
          <ChartCard title="Protein · Carbs · Fats">
            <ResponsiveContainer>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area dataKey="protein" stackId="a" stroke="#60A5FA" fill="#60A5FA" name="Proteins"/>
                <Area dataKey="carbs" stackId="a" stroke="#FBBF24" fill="#FBBF24" name="Carbs"/>
                <Area dataKey="fats" stackId="a" stroke="#F97316" fill="#F97316" name="Fats"/>
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Physical Activity */}
        <h2 className="text-base font-semibold mb-3 text-green-700">Physical Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Sleep */}
          <ChartCard title="Sleep Hours & Quality">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line dataKey="sleepHours" yAxisId="left" stroke="#06B6D4" name="Sleep hours"/>
                <Line dataKey="sleepQuality" yAxisId="right" stroke="#8B5CF6" name="Sleep quality"/>
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Steps and active minutes */}
          <ChartCard title="Daily Steps">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stepsCount" fill="#8B5CF6" name="Steps Count"/>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Active Minutes">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="activeMinutes" stroke="#10B981" name="Active minutes"/>
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Water */}
          <ChartCard title="Water Intake (in L)">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="water" fill="#17e7a2ff" name="Water Intake"/>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

        {/* Mental Wellness */}
        <h2 className="text-base font-semibold mb-3 text-green-700">Mental Wellness & other activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          <ChartCard title="Mood, Stress & Energy Levels">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mood" stroke="#34D399" name="Mood" />
                <Line type="monotone" dataKey="stress" stroke="#6366F1" name="Stress"/>
                <Line type="monotone" dataKey="energy" stroke="#EF4444" name="Energy"/>
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Weight & BMI">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="weight" stroke="#6366F1" name="Weight"/>
                <Line dataKey="bmi" stroke="#F59E0B" name="BMI"/>
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>


        </div>


        <div className="bg-white p-5 rounded-2xl shadow mb-10">
          <h3 className="text-lg font-bold mb-3 text-green-700">Insights</h3>

          {Object.keys(correlations).length === 0 ? (
            <p className="text-gray-500">Not enough data for correlational insights.</p>
          ) : (
            <ul className="space-y-3">
              {Object.entries(correlations).map(([key, obj]) => {
                const [a, b] = key.split("__");

                const sentence =
                  obj.value > 0
                    ? `When your ${Label_dict[a]} increases, your ${Label_dict[b]} also tends to increase.`
                    : `When your ${Label_dict[a]} increases, your ${Label_dict[b]} tends to decrease.`;

                return (
                  <li key={key}>
                    <div className="flex flex-col md:flex-row justify-center text-gray-800">
                      <div className="flex items-center space-x-1">
                        <strong className="text-green-800">{Label_dict[a]}</strong>
                        <span>↔</span>
                        <strong className="text-green-600">{Label_dict[b]}</strong>
                      </div>

                      <div className="text-sm text-gray-500 mt-1 md:ml-3">
                        {sentence}
                      </div>
                    </div>

                  </li>
                );
              })}
            </ul>
          )}
        </div>


      </div>
    </div>
  );
}





