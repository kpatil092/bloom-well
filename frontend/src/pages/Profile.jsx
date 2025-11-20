import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateUser } from "../services/authService";


export default function Profile() {

  const user = useSelector((s) => s.auth.user);
  // console.log(user)

  const [formData, setFormData] = useState({
    username: "", name: "", email: "", dob: "",
    gender: "", goal: "",
  });

  const [originalVals, setOriginalVals] = useState({})
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    if(user) {
      const state = {username: user.username || "",
      name: user.name || "", email: user.email || "", dob: user.dob || "",
      gender: user.gender  || "", goal: user.goal || ""}

      setOriginalVals(state)
      setFormData(state)
    }
  }, [user])

  function handleChange(e)  {
    setFormData(prev => (
      {...prev, [e.target.name]: e.target.value}
    ))
  }

  async function handleSubmit(e){ 
    e.preventDefault()
    try {
      setLoading(true)
      const res = await updateUser(formData);
      toast.success("Profile updated successfully");
      setOriginalVals(formData)
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setFormData(originalVals)
  }


  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl px-12 py-6 border border-gray-200">
        <h2 className="text-primary text-3xl font-bold text-center mb-6">
          My Profile
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10 mb-5">
          <div className="flex flex-col gap-2">
           <label className="text-sm text-gray-700">
            <span className="block mb-1 text-left px-1">Username</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary/90 outline-none"
              disabled
              required
            />
          </label>
           <label className="text-sm text-gray-700">
            <span className="block mb-1 text-left px-1">Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary/90 outline-none"
              disabled = {!!originalVals.name}
              required
            />
          </label>
          <div className="flex flex-col md:flex-row gap-2">
          <label className="w-full md:w-1/2 text-sm text-gray-700">
            <span className="block mb-1 text-left px-1">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary/90 outline-none"
              disabled
              required
            />
          </label>
          <div className="flex gap-2">
          <label className="w-full text-sm text-gray-700">
            <span className="block mb-1 text-left px-1">Date of Birth</span>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary/90 outline-none"
              disabled = {!!originalVals.dob}
              required
            />
          </label>
          <label className="w-2/3 md:w-full text-sm text-gray-700">
            <span className="block mb-1 text-left px-1">Gender</span>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary/90 outline-none"
              disabled = {!!originalVals.gender}
              required
            >
              <option value="" defaultValue={""}>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </label>
          </div>
          </div>

          <label className="text-sm text-gray-700">
            <span className="block mb-1 text-left px-1">Self Goal</span>
            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary outline-none"
              rows="3"
              placeholder="Set your goal here..."
            />
          </label>

          </div>

          <div className="w-full flex md:flex-row flex-col justify-around gap-2 md:gap-0 ">
        <button type="submit" className="bg-primary md:w-1/3 w-full py-2.5 rounded-lg text-white font-medium  
                    transition hover:bg-primary/90 disabled:bg-primary/70" 
        disabled={JSON.stringify(formData)===JSON.stringify(originalVals) ||  loading}>
                      Update
            </button>
        <button className="bg-col3 md:w-1/3 w-full py-2.5 rounded-lg text-white font-medium  
                    transition hover:bg-col3/90 disabled:bg-col3/70" 
            disabled={JSON.stringify(formData)===JSON.stringify(originalVals) || loading} onClick={handleCancel}>
                      Cancel
            </button>
            </div>

        </form>

        
      </div>
    </div>
  )
}