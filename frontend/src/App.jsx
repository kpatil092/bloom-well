import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen p-8">
      <nav className="mb-8">
        <Link to="/" className="text-xl font-bold">Health&Wellness</Link>
      </nav>
      <main>
        <h1 className="text-3xl font-semibold mb-4">Welcome — Landing (pre-login)</h1>
        <p className="mb-6">Get started with health tracking.</p>
        <Link to="/home" className="px-4 py-2 bg-blue-600 text-white rounded">Get started</Link>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/home" element={<div className="p-8">Home (after login placeholder)</div>} />
      <Route path="*" element={<div className="p-8">404</div>} />
    </Routes>
  )
}
