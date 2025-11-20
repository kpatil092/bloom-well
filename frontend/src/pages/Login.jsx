import { useState } from "react"
import { loginUser } from "../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      const data = await loginUser({username, password})
      console.log(data)
      dispatch(setUser({user: data.user, token: data.token}))
      localStorage.setItem("token", data.token);
    toast.success("login successful")
      setUsername("")
    setPassword("")
    navigate("/")
    console.log(data)
      console.log("Login")
    } catch (err) {
      toast.error(err.message)
    }
  } 

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-2">
    <div className="md:w-[50%] max-w-5xl bg-white shadow-xl rounded-2xl 
                    overflow-hidden flex flex-col md:flex-row border border-gray-200">
    

      {/* Left Side */}
      <div className="hidden md:flex md:w-1/3 bg-cover bg-center">
      <div className="bg-black/40 w-full h-full flex flex-col justify-center items-center text-white p-8">
      <h1 className="text-3xl font-semibold font-serif mb-2">Bloom-well</h1>
      </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
        <h2 className="text-3xl font-semibold text-center text-emerald-600 mb-5">Log In</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
        <label htmlFor="username" className="text-sm text-gray-700 w-full">
          <span className="block w-full text-left p-1"> Username </span>
          <input type="text" 
          name="username"
          value={username} 
          onChange={u => setUsername(u.target.value.trim())} 
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:ring-0 outline-none" 
          required />
        </label>
          <label htmlFor={password} className="text-sm text-grey-700">
           <span className= "block w-full text-left p-1"> Password </span>
            <input 
            type="password" 
            value={password} 
            onChange={u => setPassword(u.target.value.trim())} 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary 
                        focus:ring-0 outline-none"
            required/>
          </label>
        </div>
          <button className="bg-primary w-full py-2.5 rounded-lg text-white font-medium  
                    transition hover:bg-primary/90">
                      Log In
            </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <a href="/signup" className="text-primary/90  hover:underline  font-medium">Sign up</a>
          </p>
      </div>
      
    </div>
    </div>
  )
}