import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import store from './store'
import { ToastContainer } from 'react-toastify'

function App() {


  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes/>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </BrowserRouter>
    </Provider>
  )
}


export default App
