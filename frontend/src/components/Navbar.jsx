import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  // const user = {
  //   name: "Alice",
  //   email: "alice@example.com",
  //   id: "123",
  // };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="bg-navbar shadow-sm p-4 flex justify-between items-center relative">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">
          BW
        </div>
        <div>
          <div className="font-bold text-lg text-[var(--text-primary)]">
            Bloom-Well
          </div>
          <div className="text-xs text-small-muted">
            Health & Wellness Tracker
          </div>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Link to="/" className="text-sm small-muted">
              Home
            </Link>
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
            <Link to="/signup" className="btn-primary">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            {/* Logged-in links */}
            <Link to="/" className="text-sm small-muted">
              Home
            </Link>
            <Link to="/dashboard" className="text-sm small-muted">
              Dashboard
            </Link>

            {/* User avatar + dropdown */}
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 hover:bg-[var(--primary)] hover:text-white transition"
                  >
                    Profile
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-[var(--cta)] hover:text-white transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
