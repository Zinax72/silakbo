import { useState } from 'react'
import { Navigate, useNavigate, useParams, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useBooking } from '../context/BookingContext'
import { useAuth } from '../context/AuthContext'
import { addBooking } from '../services/CinemaServices'
import { getTotal } from '../lib/constants'

const PAYMENT_METHODS = ["GCash", "Card", "Cash at Counter"];

const PaymentPage = () => {
    const { draft } = useBooking();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [method, setMethod] = useState("");
    const [paying, setPaying] = useState(false);

    if (!draft.movieID || draft.seats.length === 0) return <Navigate to="/NowShowing" />
    if (!user) return <Navigate to="/LoginPage" state={{ from: location }} />

    const handlePay = async () => {
        if (!method) return toast.error("Please choose a payment method");

        setPaying(true)
        try {
            const booking = {
                ...draft,
                uid: user.uid,
                totalPrice: getTotal(draft.seats.length),
                paymentMethod: method,
            }
            
            await new Promise((resolve) => setTimeout(resolve, 1500))

            const result = await addBooking(booking)

            if(!result.success) {
                toast.error(result.message)
                if(result.message === "Seat already taken.") navigate(`/movie/${id}/seats`)
                return
            }
            const ref = result.data
            navigate(`/movie/${draft.movieID}/confirmation`, { state: { ...booking, ref } })
        } catch (error) {   
            toast.error("Payment failed. Please try again.")
        } finally {
            setPaying(false);
        }
    }
    return (
    <div>
      <h1>Payment</h1>

      <p>{draft.movieTitle}</p>
      <p>{draft.cinema} · {draft.date} · {draft.time}</p>
      <p>Seats: {draft.seats.join(", ")}</p>
      <p>Tickets: {draft.seats.length}</p>
      <p>Total: ₱{getTotal(draft.seats.length)}</p>

      <h3>Payment method</h3>
      {PAYMENT_METHODS.map((m) => (
        <button
          key={m}
          type="button"
          disabled={paying}
          onClick={() => setMethod(m)}
        >
          {m}{m === method ? " ✓" : ""}
        </button>
      ))}

      <button
        type="button"
        onClick={handlePay}
        disabled={paying || !method}
      >
        {paying ? "Processing..." : `Pay ₱${getTotal(draft.seats.length)}`}
      </button>
    </div>
  )
}

export default PaymentPage
