import axios from "axios"
import index from "../store"
import { logout } from "../store/slices/authSlice"

const BASE_RUL = import.meta.env.VITE_API_BASE_URL

const axiosClient = axios.create({
  baseURL: BASE_RUL,
  headers: {'Content-Type': 'application/json'}
})

axiosClient.interceptors.request.use((config) => {
  const token = index.getState().auth.token
  if(token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosClient.interceptors.response.use(
  response => response, 
  error => {
    if(error.response?.status === 401) index.dispatch(logout())
    return Promise.reject(error)
  }
)

export default axiosClient;