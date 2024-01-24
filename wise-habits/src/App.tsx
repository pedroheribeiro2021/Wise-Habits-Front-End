import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import { Providers } from './components/providers/providers'
import Register from './pages/register'
import Dashboard from './pages/dashboard'

function App() {
  return (
    <main>
      <Providers>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Dashboard />} />
        </Routes>
      </Providers>
    </main>
  )
}

export default App
