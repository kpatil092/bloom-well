import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("token");
    navigate('/')

  }

  return (
  <div className="bg-tertiary shadow-sm p-4 flex justify-between items-center relative ">
    <Link to='/'>
      <h1 className="text-lg font-bold">Bloom-well</h1>
    </Link>
    <div className="flex gap-4">
      {!user ? (
      <><Link to='/signup' className="btn-primary">Sign Up</Link>
      <Link to='/login' className="btn-seconday">Login</Link></>
      ) : (
        <>
        <Link to='/dashboard' className="btn-primary">Dashboard</Link>
        <Link to='/wellness' className="btn-primary">Wellness</Link>
        <Link to='/profile' className="btn-primary">Profile</Link>
        <button onClick={handleLogout} className="btn-seconday">Logout</button>
        </>
      )}
      
    </div>
  </div>
  )
}