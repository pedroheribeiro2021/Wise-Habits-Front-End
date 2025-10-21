import React, { useEffect } from 'react'
import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/login'
import { Providers } from './components/providers/providers'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import ReactModal from 'react-modal'
import HabitsChart from './pages/reports'
import { setupInterceptors } from './services/api'

function App() {
  ReactModal.setAppElement('#root')

  const navigate = useNavigate()

  useEffect(() => {
    setupInterceptors(navigate)
  }, [navigate])

  return (
    <main>
      <Providers>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/graph" element={<HabitsChart />} />
        </Routes>
      </Providers>
    </main>
  )
}

export default App
