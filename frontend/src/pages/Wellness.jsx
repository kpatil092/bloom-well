import React, { useEffect, useState } from "react";
import MetricCard from "../components/MetricCard";

import { toast } from "react-toastify";

import {Moon, Activity, Droplet, Smile, AlertTriangle, BatteryCharging, HeartPulse} from "lucide-react";

import { getTodayWellness, getYesterdayWellness, fillTodayWellness } from "../services/wellnessService";


export default function Wellness() {
  const [form, setForm] = React.useState({
    sleepHours: 8,
    sleepQuality: 3,
    activeMinutes: 45,
    stepsCount: 8000,
    water: 7.5,
    weight: 65,
    height: 1.75,
    mood: 3,
    stress: 3,
    energy: 3,
  });

  const [originalVals, setOriginalVals] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const today = await getTodayWellness();
        if(today.exists) {
          setForm(today.metrics)
          setOriginalVals(today.metrics)
        } else {
          const yesterday = await getYesterdayWellness()
          setForm(yesterday.metrics)
          setOriginalVals(yesterday.metrics)
        }
      } catch (error) {
        console.log("Error: ", error);
        toast.error("Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])


  function handleChange(name, value) {
    setForm((prev) => ({ ...prev, 
      [name]: value === "" || value === null ? "" : Number(value)
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true)
      const res = await fillTodayWellness({...form})
      // console.log(res)
      toast.success("Entry added/updated")
      setOriginalVals(res.metrics)
      setForm(res.metrics)
    } catch (e) {
      console.log("Error: ", e)
      toast.error("Something went wrong")
    } finally {
      setSaving(false)
    }

  }

  function handleCancel() {
    if(originalVals) {
      setForm(originalVals)
      toast.info("Changes reverted", {autoClose: 500})
    }
  }

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <p>Loading...</p>
  //     </div>
  //   )
  // }


  return (
    <div className="container flex flex-col gap-4 p-4">

      <div className="flex flex-row justify-between px-5 ">
      <h1 className="text-3xl block text-left text-primary font-bold my-6">Daily Measures</h1>

      <div className="flex flex-col justify-center items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <span className="text-sm text-gray-500">{time.toLocaleDateString('en-In', {
          weekday: "long", year: "numeric", month: "long", day: "numeric",})}</span>
          <span className="text-lg font-medium text-gray-800 mt-1"> {time.toLocaleTimeString("en-IN", { hour12: true })} </span>
        </div>

      </div>

    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
    <div className="flex flex-col w-full gap-4 border-b-2 border-gray-200 pb-12">
      
      <h2 className="text-base block text-left  text-primary font-light px-5">Physical Activity</h2>

      
      <div className="grid w-full gap-8 grid-cols-1 md:grid-cols-3">
    <MetricCard
        title="Sleep"
        icon={<Moon className="h-5 w-5" />}
        onChange={handleChange}
        fields={[
          { type:"number", label: "Hours", name: "sleepHours", value: form.sleepHours, min: 0, max: 24, step: 0.5, placeholder: "8" },
          { type:"range", label: "Quality", name: "sleepQuality", value: form.sleepQuality, min: 1, max: 5, step: 1 },
        ]}
      />

      <MetricCard
        title="Activity"
        icon={<Activity className="h-5 w-5" />}
        type="input"
        onChange={handleChange}
        fields={[
          { type:"number", label: "Active minutes (Sports, Exercise, etc.)", name: "activeMinutes", value: form.activeMinutes, placeholder: "45", min: 0},
          { type:"number", label: "Steps", name: "stepsCount", value: form.stepsCount, min: 1, placeholder: "8000" },
        ]}
      />
      <MetricCard
        title="Water Intake"
        icon={<Droplet className="h-5 w-5" />}
        type="input"
        onChange={handleChange}
        fields={[
          { type:"number", label: "Water (in L)", name: "water", value: form.water, min: 1, max: 300,placeholder: "7", step: 0.1},
        ]}
      /></div>
      </div>

      
    <div className="flex flex-col w-full gap-4 border-b-2 border-gray-200 pb-12">
      <h2 className="text-base block text-left px-5 text-primary font-light">Mental Wellness</h2>
      <div className="grid w-full gap-8 grid-cols-1 md:grid-cols-3">
    <MetricCard
        title="Mood Summary"
        icon={<Smile className="h-5 w-5" />}
        onChange={handleChange}
        fields={[
          { type:"range", label: "Mood", name: "mood", value: form.mood, min: 1, max: 5, step: 1 },
        ]}
        note= "Mood level: 1 - very low, 5 - very positive"
      />

      <MetricCard
        title="Stress Level"
        icon={<AlertTriangle className="h-5 w-5" />}
        type="input"
        onChange={handleChange}
        fields={[
          { type:"range", label: "Stress", name: "stress", value: form.stress, min: 1, max: 5, step: 1 },
        ]}
        note= "Stress level: 1 - very low, 5 - very high"
      />
      <MetricCard
        title="Energy Level"
        icon={<BatteryCharging className="h-5 w-5" />}
        type="input"
        onChange={handleChange}
        fields={[
          { type:"range", label: "Energy", name: "energy", value: form.energy, min: 1, max: 5, step: 1 },
        ]}
        note= "Energy level: 1 - very low, 5 - very high"
      /></div>
      </div>

      
    <div className="flex flex-col w-full gap-4 border-b-2 border-gray-200 pb-12">
      <h2 className="text-base block text-left px-5 text-primary font-light">Other Activity</h2>
      <div className="grid w-full gap-8 grid-cols-1 md:grid-cols-3">
    <MetricCard
        title="Body Parameters"
        icon={<HeartPulse className="h-5 w-5" />}
        type="input"
        onChange={handleChange}
        fields={[
          { type:"number", label: "Weight (in kg)", name: "weight", value: form.weight, min: 1, max: 300,placeholder: "65", step: 0.1},
          { type:"number", label: "Height (in m)", name: "height", value: form.height, min: 1, max: 7, step: 0.01, placeholder: "1.85" },
        ]}
      />

      </div>
      </div>

        <div className="w-full flex md:flex-row flex-col md:justify-center items-center gap-5 md:gap-10 my-12">
        <button type="submit" className="bg-primary md:w-1/3 w-full py-2.5 rounded-lg text-white font-medium  
                    transition hover:bg-primary/90 disabled:bg-primary/70 max-w-56" 
        disabled={saving}
        >
                      Add
            </button>
        <button className="bg-col3 md:w-1/3 w-full py-2.5 rounded-lg text-white font-medium  
                    transition hover:bg-col3/90 disabled:bg-col3/70 max-w-56" 
            disabled={saving} onClick={handleCancel}
            type="button"
            >
                      Cancel
            </button>
            </div>
      
    </form>
      </div>
  )
}