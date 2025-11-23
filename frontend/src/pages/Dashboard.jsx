import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "../services/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  ComposedChart,
  CartesianGrid,
  BarChart,
  Bar,
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

function correlationStrength(value) {
  const v = Math.abs(value);
  if (v >= 0.65) return "Strong";
  if (v >= 0.4) return "Moderate";
  return "Weak";
}


export default function Dashboard() {
  const [days, setDays] = useState(7);
  const [rawData, setRawData] = useState([]);
  const [correlations, setCorrelations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch wellness range + analysis
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

  // Compute BMI & number conversions
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
                <Line type="monotone" dataKey="calories" stroke="#10B981" strokeWidth={2} />
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
                <Area dataKey="protein" stackId="a" stroke="#60A5FA" fill="#60A5FA" />
                <Area dataKey="carbs" stackId="a" stroke="#FBBF24" fill="#FBBF24" />
                <Area dataKey="fats" stackId="a" stroke="#F97316" fill="#F97316" />
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
                <Line dataKey="sleepHours" yAxisId="left" stroke="#06B6D4" />
                <Line dataKey="sleepQuality" yAxisId="right" stroke="#8B5CF6" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Steps + active minutes */}
          <ChartCard title="Steps & Active Minutes">
            <ResponsiveContainer>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stepsCount" barSize={20} fill="#8B5CF6" />
                <Line dataKey="activeMinutes" stroke="#10B981" />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Water */}
          <ChartCard title="Water Intake (glasses)">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="water" fill="#17e7a2ff" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

        {/* Mental Wellness */}
        <h2 className="text-base font-semibold mb-3 text-green-700">Mental Wellness</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          <ChartCard title="Mood vs Stress">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="mood" stroke="#34D399" />
                <Line dataKey="stress" stroke="#F43F5E" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Energy Levels">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="energy" stroke="#EF4444" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

        {/* Weight & BMI */}
        <h2 className="text-base font-semibold mb-3 text-green-700">Other Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <ChartCard title="Weight & BMI">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="weight" stroke="#6366F1" />
                <Line dataKey="bmi" stroke="#F59E0B" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ================== ANALYSIS INSIGHTS =================== */}
        <div className="bg-white p-5 rounded-2xl shadow mb-10">
          <h3 className="text-lg font-bold mb-3 text-green-700">Insights</h3>

          {Object.keys(correlations).length === 0 ? (
            <p className="text-gray-500">Not enough data for insights.</p>
          ) : (
            <ul className="space-y-3">
              {Object.entries(correlations).map(([key, obj]) => {
                const [a, b] = key.split("__");
                const abs = Math.abs(obj.value);

                // Determine strength text
                const strength =
                  abs >= 0.65 ? "Strong" : abs >= 0.4 ? "Moderate" : "Weak";

                // Create human sentence
                const sentence =
                  obj.value > 0
                    ? `When your ${a} increases, your ${b} also tends to increase.`
                    : `When your ${a} increases, your ${b} tends to decrease.`;

                return (
                  <li key={key}>
                    {/* Heading */}
                    <div className="flex flex-col md:flex-row justify-center text-gray-800">
                      <div className="flex items-center space-x-1">
                        <strong className="text-green-800">{a}</strong>
                        <span>↔</span>
                        <strong className="text-green-600">{b}</strong>
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





