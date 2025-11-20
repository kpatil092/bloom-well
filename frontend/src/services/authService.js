import axiosClient from "./api"

export async function loginUser(data) {
  try {
    const response = await axiosClient.post("/auth/login", data); 
    console.log(response)
    return response.data
  } catch(err) {
    if(err.response) {
      const msg =err.response.data?.message || err.response.data || err.response.statusText
      throw new Error(msg)
    }
    throw new Error("Something went wrong")
  }
}

export async function signupUser(data) {
  try {
    const response = await axiosClient.post("/auth/signup", data); 
    return response.data
  } catch(err) {
    if(err.response) {
      const msg =err.response.data?.message || err.response.data || err.response.statusText
      throw new Error(msg)
    }
    throw new Error("Something went wrong")
  }
}


export async function getCurrentUser(data) {
  try {
    const response = await axiosClient.get("/auth/current-user", {withCredentials: true}); 
    return response.data.user
  } catch(err) {
    if(err.response) {
      const msg =err.response.data?.message || err.response.data || err.response.statusText
      throw new Error(msg)
    }
    throw new Error("Something went wrong")
  }
}

export async function updateUser(data) {
  try {
    const response = await axiosClient.post("/auth/update-user", data, {withCredentials: true}); 
    return response.data.user
  } catch(err) {
    if(err.response) {
      const msg =err.response.data?.message || err.response.data || err.response.statusText
      throw new Error(msg)
    }
    throw new Error("Something went wrong")
  }
}