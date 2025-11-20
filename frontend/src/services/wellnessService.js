import axiosClient from "./api"

export async function getTodayWellness() { 
  const res = await axiosClient.get("/wellness/today"); 
  return res.data; 
}

export async function getYesterdayWellness() {
   const res = await axiosClient.get("/wellness/yesterday"); 
   return res.data; 
} 

export async function fillTodayWellness(data) {
   const res = await axiosClient.post("/wellness/today", data); 
   return res.data;
} 

export async function getWellnessRange(start, end) {
  const res = await axiosClient.get(`/wellness/range?start=${start}&end=${end}`); 
  return res.data;
}
