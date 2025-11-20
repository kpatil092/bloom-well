import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Home from '../pages/Home'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import Dashboard from '../pages/Dashboard'
import Nutrition from '../pages/Nutritions'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '../services/authService'
import { logout, setUser } from '../store/slices/authSlice'
import Profile from '../pages/Profile'
import Wellness from '../pages/Wellness'

function AppRoutes() {

  const user = useSelector(s => s.auth.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const token = localStorage.getItem('token')
    async function fetchUser() {
      if(token) {
        try {
          const user = await getCurrentUser()
          dispatch(setUser({user, token}))
          // console.log(user)
        } catch (error) {
          dispatch(logout())
          localStorage.removeItem('token')
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    fetchUser()
  }, [dispatch])

  if (loading) {
    return (
      <div className='min-h-screen flex flex-col align-center'>
        <Navbar/>
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
      </div>
    )
  }


  return (
    <div className='min-h-screen flex flex-col align-center'>
        <Navbar/>
    <main className='flex-1 container mx-auto px-4 py-8'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={!user ? <Login/> :  <Navigate to="/" replace />}/>
          <Route path='/signup' element={!user ? <SignUp/> : <Navigate to="/" replace />}/>
          <Route path='/dashboard' element={user ? <Dashboard/> : <Navigate to="/login" replace />}/>
          <Route path='/nutritions' element={user ? <Nutrition/> : <Navigate to="/login" replace />}/>
          <Route path='/wellness' element={user ? <Wellness/> : <Navigate to="/login" replace />}/>
          <Route path='/profile' element={user ? <Profile/> : <Navigate to="/login" replace />}/>
          <Route path='*' element={<Navigate to="/" />}/>
        </Routes>
    </main>
    </div>
  )
}

export default AppRoutes
