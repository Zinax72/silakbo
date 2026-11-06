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
  const fee = tickets * BOOKING_FEE;
  const total = getTotal(tickets);

  return (
    <div className="flex-1 bg-base text-cream px-6 py-12 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-cream rounded-3xl p-8 shadow-2xl text-maroon border border-maroon/10">
        <h1 className="font-heading text-3xl mb-6 text-center tracking-wide">Order Summary</h1>

        <div className="flex gap-4 items-center bg-base/5 p-4 rounded-2xl mb-6 border border-maroon/5">
          <img src={`https://image.tmdb.org/t/p/w500${draft.posterPath}`} alt={draft.movieTitle} className="w-20 h-28 object-cover rounded-xl shadow-md" />
          <div className="space-y-1">
            <h2 className="font-heading text-xl">{draft.movieTitle}</h2>
            <p className="text-sm opacity-80">{draft.cinema} · {draft.date} · {draft.time}</p>
            <p className="text-sm opacity-80">Seats: <span className="font-semibold">{draft.seats.join(", ")}</span></p>
          </div>
        </div>

        <div className="space-y-2 text-sm border-t border-b border-maroon/10 py-4 mb-6">
          <div className="flex justify-between">
            <span className="opacity-80">Tickets ({tickets} × ₱{TICKET_PRICE})</span>
            <span className="font-semibold">₱{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-80">Booking Fee</span>
            <span className="font-semibold">₱{fee}</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-maroon/10">
            <span>Total</span>
            <span>₱{total}</span>
          </div>
        </div>

        <button 
          onClick={() => navigate(`/movie/${draft.movieID}/payment`)}
          className="w-full py-3 rounded-full bg-maroon text-cream font-medium shadow-md hover:bg-maroon/90 transition-all cursor-pointer text-sm"
        >
          Proceed to payment
        </button>
      </div>
    </div>
  )
}

export default SummaryPage;
