import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import NowShowing from './pages/NowShowing'
import ComingSoon from './pages/ComingSoon'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Layout from "./layout/Layout";
import MoviePage from './pages/MoviePage'
import SeatsPage from './pages/SeatsPage'
import SummaryPage from './pages/SummaryPage'
import PaymentPage from './pages/PaymentPage'
import ConfirmationPage from './pages/ConfirmationPage'
import MyTickets from './pages/MyTickets'
import EditSeatsPage from "./pages/EditSeatsPage"
import NotFound from './pages/NotFound'


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
            <Route path="/movie/:id/seats" element={<SeatsPage />} />
            <Route path="/movie/:id/summary" element={<SummaryPage />} />
            <Route path="/movie/:id/payment" element={<PaymentPage />} />
            <Route path="/movie/:id/confirmation" element={<ConfirmationPage />} />

            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/my-tickets/edit" element={<EditSeatsPage />} />

            <Route path="*" element={<NotFound />} />
          </Route>
      </Routes>

    </> 
  )
}

export default App
