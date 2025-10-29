import { useState } from "react"
import { loginUser } from "../services/authService";

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault();
    setUsername("")
    setPassword("")
    setError("")
    setMessage("")
    try {
      const data = await loginUser({username, password})
      setMessage("login successful")
      console.log("Login")
    } catch (err) {
      setError("Error")
    }
  } 
  return (
    <div className="container shadow-md flex flex-col p-4 justify-center bg-col4">
      <h2 className="text-lg font-bold mt-3">Login</h2>
      {message && <div className="flex justify-center items-center h-12 bg-green-100 text-green-700 rounded mt-3">{message}</div>}
      {error && <div className="flex justify-center items-center h-12 bg-red-100 text-red-700 rounded mt-3">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-96 mt-6">
        <label className="flex flex-col gap-1 ">
          <span>Username</span>
          <input type="text" value={username} onChange={u => setUsername(u.target.value)} className="border border-col2 rounded p-2" required />
        </label>
          <label className="flex flex-col gap-1">
            <span>Password</span>
            <input type="password" value={password} onChange={u => setPassword(u.target.value)} className="border border-col2 rounded p-2 "required/>
          </label>
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">Log In</button>
      </form>
    </div>
  )
}