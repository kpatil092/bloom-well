import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../store/slices/authSlice";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  // const user = {
  //   name: "Alice",
  //   email: "alice@example.com",
  //   id: "123",
  // };

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    dob: user?.dob || "",
    country: user?.country || "",
    height: user?.height || "",
    weight: user?.weight || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser(formData));
    alert("Profile updated successfully!");
  };

  if (!user) return <p className="text-center text-gray-500">Please log in</p>;

  return (
    <div className="max-w-3xl mx-auto card space-y-6">
      <h2 className="text-2xl font-bold">Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col">
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />
          </label>
          <label className="flex flex-col">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
              disabled
            />
          </label>
          <label className="flex flex-col">
            Date of Birth
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="p-2 border rounded-lg"
            />
          </label>
          <label className="flex flex-col">
            Country
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="p-2 border rounded-lg"
            />
          </label>
          <label className="flex flex-col">
            Height (cm)
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="p-2 border rounded-lg"
            />
          </label>
          <label className="flex flex-col">
            Weight (kg)
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="p-2 border rounded-lg"
            />
          </label>
        </div>
        <button type="submit" className="btn-primary mt-3 self-start">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
