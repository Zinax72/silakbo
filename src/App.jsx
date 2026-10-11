import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NowShowing from './pages/NowShowing'
import ComingSoon from './pages/ComingSoon'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Layout from "./layout/Layout";

function App() {

  return (
    <>
      <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />  
            <Route path="/NowShowing" element={<NowShowing />} />
            <Route path="/ComingSoon" element={<ComingSoon />} />
            <Route path="/LoginPage" element={<LoginPage />} />
            <Route path="/RegisterPage" element={<RegisterPage />} />
          </Route>
      </Routes>

    </>
  )
}

export default App
