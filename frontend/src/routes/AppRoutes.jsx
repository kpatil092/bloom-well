import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Home from '../pages/Home'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import Dashboard from '../pages/Dashboard'
import Nutrition from '../pages/Nutritions'
import Navbar from '../components/Navbar'

function AppRoutes() {

  const user = useSelector(s => s.auth.user)

  return (
    <nav>
        <Navbar/>
    <main>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={!user ? <Login/> :  <Navigate to="/" replace />}/>
          <Route path='/signup' element={!user ? <SignUp/> : <Navigate to="/" replace />}/>
          <Route path='/dashboard' element={user ? <Dashboard/> : <Navigate to="/login" replace />}/>
          <Route path='/nutritions' element={user ? <Nutrition/> : <Navigate to="/login" replace />}/>
          <Route path='*' element={<Navigate to="/" />}/>
        </Routes>
      </main>
    </nav>
  )
}

export default AppRoutes
