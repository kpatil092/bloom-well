import axiosClient from "./api"

export async function loginUser(data) {
  try {
    const response = await axiosClient.post("/auth/login", data); 
    return response.data
  } catch(err) {
    throw new Error("error")
  }
}