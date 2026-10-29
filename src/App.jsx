import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NowShowing from './pages/NowShowing'
import ComingSoon from './pages/ComingSoon'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Layout from "./layout/Layout";
import MoviePage from './pages/MoviePage'
import BookingPage from './pages/BookingPage'
import SeatsPage from './pages/SeatsPage'
import SummaryPage from './pages/SummaryPage'

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
            <Route path="/movie/:id" element={<MoviePage />} />
            <Route path="/movie/:id/book" element={<BookingPage />} />
            <Route path="/movie/:id/seats" element={<SeatsPage />} />
            <Route path="/movie/:id/summary" element={<SummaryPage />} />
          </Route>
      </Routes>

    </>
  )
}

export default App
