import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/login'
import { Providers } from './components/providers/providers'
import { ToastContainer } from 'react-toastify'
import Register from './pages/register'

function App() {
  return (
    <main>
      <ToastContainer />
      <Providers>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Providers>
    </main>
  )
}

export default App
