import { useState } from "react"
import { signupUser } from "../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || !password || !email || !confirmPassword) {
      toast.error("All fields are required")
      return
    }

    if (username.length < 2) {
      toast.error("Username must be at least 2 characters")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    
    if (password !== confirmPassword) {
      toast.error("Password doesn't match")
      return
    }

    try {
      const data = await signupUser({username, email, password})
      setUsername("")
    setPassword("")
    setConfirmPassword("")
    setEmail("")
      toast.success("Signup successful")
      navigate("/login")
      console.log("SignUp")
    } catch (err) {
      console.log(err)
      toast.error("Error")
    }
  } 

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-2">
    <div className="md:w-[50%] max-w-5xl bg-white shadow-xl rounded-2xl 
                    overflow-hidden flex flex-col md:flex-row border border-gray-200">
  

      {/* Left Side */}
      <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
        <h2 className="text-3xl font-semibold text-center text-emerald-600 mb-5">Sign Up</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
        <label htmlFor="username" className="text-sm text-gray-700 w-full">
          <span className="block w-full text-left p-1"> Username </span>
          <input type="text" 
          name="username"
          value={username} 
          onChange={u => setUsername(u.target.value)} 
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:ring-0 outline-none" 
          required />
        </label>
        <label htmlFor="email" className="text-sm text-gray-700 w-full">
          <span className="block w-full text-left p-1"> Email </span>
          <input type="email" 
          name="email"
          value={email} 
          onChange={u => setEmail(u.target.value)} 
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary focus:ring-0 outline-none" 
          required />
        </label>
          <label htmlFor={password} className="text-sm text-grey-700">
           <span className= "block w-full text-left p-1"> Password </span>
            <input 
            type="password" 
            value={password} 
            onChange={u => setPassword(u.target.value)} 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary 
                        focus:ring-0 outline-none"
            required/>
          </label>
          <label htmlFor={confirmPassword} className="text-sm text-grey-700">
           <span className= "block w-full text-left p-1"> Confirm Password </span>
            <input 
            type="password" 
            value={confirmPassword} 
            onChange={u => setConfirmPassword(u.target.value)} 
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary 
                        focus:ring-0 outline-none"
            required/>
          </label>
        </div>
          <button className="bg-primary w-full py-2.5 rounded-lg text-white font-medium  
                    transition hover:bg-primary/90">
                      Sign Up
            </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-primary/90  hover:underline  font-medium">Log In</a>
          </p>
      </div>

      {/* Right Side */}
      <div className="hidden md:flex md:w-1/3 bg-cover bg-center">
      <div className="bg-green-200 w-full h-full flex flex-col justify-center items-center text-black/80 p-8">
      <h1 className="text-3xl font-semibold font-serif mb-2">Bloom-well</h1>
      </div>
      </div>
      
    </div>
    </div>
  )
}