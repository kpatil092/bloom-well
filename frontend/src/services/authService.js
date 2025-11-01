import axiosClient from "./api"

export async function loginUser(data) {
  try {
    const response = await axiosClient.post("/auth/login", data); 
    return response.data
  } catch(err) {
    throw new Error("error")
  }
}

export async function signupUser(data) {
  try {
    const response = await axiosClient.post("/auth/signup", data); 
    return response.data
  } catch(err) {
    throw new Error("error")
  }
}


export async function getCurrentUser(data) {
  try {
    const response = await axiosClient.get("/auth/current-user", {withCredentials: true}); 
    return response.data.user
  } catch(err) {
    throw new Error("error")
  }
}

export async function updateUser(data) {
  try {
    const response = await axiosClient.post("/auth/update-user", data, {withCredentials: true}); 
    return response.data.user
  } catch(err) {
    throw new Error("error")
  }
}