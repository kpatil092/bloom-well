import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // *static demo* - replace with real API call
    dispatch(setUser({ id: "1", name: "Demo User", email }));
    navigate("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-2xl font-bold">Login</h2>
      <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
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
        <button className="btn-primary mt-2">Sign in</button>
      </form>
    </div>
  );
};

export default Login;
