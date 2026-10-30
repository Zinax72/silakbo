import { Navigate, useNavigate, useLocation } from "react-router-dom"
import { useBooking } from "../context/BookingContext"
import { TICKET_PRICE, BOOKING_FEE, getTotal } from "../lib/constants"
import { useAuth } from "../context/AuthContext"

const SummaryPage = () => {
  const { draft } = useBooking();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!draft.movieID || draft.seats.length === 0) return <Navigate to="/NowShowing" />
  if (!user) return <Navigate to="/LoginPage" state={{ from: location }} />

  const tickets = draft.seats.length;
  const subtotal = tickets * TICKET_PRICE;
  const fee = tickets * BOOKING_FEE
  const total = getTotal(tickets);

  return (
    <div>
      <img src={`https://image.tmdb.org/t/p/w500${draft.posterPath}`} alt={draft.movieTitle} />    
      <h1>{draft.movieTitle}</h1>

      <p>{draft.cinema} · {draft.date} · {draft.time}</p>

      <p>Seats: {draft.seats.join(", ")}</p>

      <p>Tickets: ({tickets} x ₱{TICKET_PRICE}) - ₱{subtotal}</p>
      <p>Booking Fee - ₱{fee}</p>
      <p>Total - ₱{total}</p>

      <button onClick={() => navigate(`/movie/${draft.movieID}/payment`)}>Proceed to payment</button>
    </div>
  )
}

export default SummaryPage
