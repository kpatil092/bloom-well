import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { useSelector } from "react-redux";
import Nutritions from "./pages/Nutritions";
import Timetable from "./pages/Timetable";
import WellBeing from "./pages/Wellbeing";
import Profile from "./pages/Profile";

const App = () => {
  const user = useSelector((s) => s.auth.user);

  // const user = {
  //   name: "Alice",
  //   email: "alice@example.com",
  //   id: "123",
  // };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/nutritions"
            element={user ? <Nutritions /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/timetable"
            element={user ? <Timetable /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/wellbeing"
            element={user ? <WellBeing /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
