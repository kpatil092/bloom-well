import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords must match");
      return;
    }
    dispatch(setUser({ id: "1", name, email }));
    navigate("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-2xl font-bold">Sign up</h2>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col">
          <span className="small-muted">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-2 border rounded-lg"
          />
        </label>
        <label className="flex flex-col">
          <span className="small-muted">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 p-2 border rounded-lg"
            type="email"
          />
        </label>
        <label className="flex flex-col">
          <span className="small-muted">Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 p-2 border rounded-lg"
            type="password"
          />
        </label>
        <label className="flex flex-col">
          <span className="small-muted">Confirm password</span>
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 p-2 border rounded-lg"
            type="password"
          />
        </label>
        <button className="btn-primary mt-2">Create account</button>
      </form>
    </div>
  );
};

export default Signup;
