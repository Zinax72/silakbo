import { useState } from 'react'
import { Navigate, useNavigate, useParams, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useBooking } from '../context/BookingContext'
import { useAuth } from '../context/AuthContext'
import { addBooking } from '../services/CinemaServices'
import { getTotal } from '../lib/constants'

const PAYMENT_METHODS = ["GCash", "Card"];

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
    <div className="flex-1 bg-base text-cream px-6 py-12 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-cream rounded-3xl p-8 shadow-2xl text-maroon border border-maroon/10">
        <h1 className="font-heading text-3xl mb-6 text-center tracking-wide">Payment</h1>

        <div className="bg-base/5 p-4 rounded-2xl mb-6 space-y-1 border border-maroon/5 text-sm">
          <p className="font-heading text-xl tracking-[5px]">{draft.movieTitle}</p>
          <p className="text-md opacity-80">{draft.cinema} · {draft.date} · {draft.time}</p>
          <p className="text-md opacity-80">Seats: <span className="font-semibold text-md">{draft.seats.join(", ")}</span></p>
          <p className="text-base font-bold text-lg">Total: ₱{getTotal(draft.seats.length)}</p>
        </div>

        <h3 className="font-heading text-xl mb-3 text-center tracking-[5px]">Payment method</h3>
        <div className="grid grid-cols-2 gap-2 mb-8">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m}
              type="button"
              disabled={paying}
              onClick={() => setMethod(m)}
              className={`py-3 px-2 rounded-2xl text-sm font-semibold transition-all border cursor-pointer ${
                method === m 
                  ? 'bg-maroon text-cream border-maroon shadow-md' 
                  : 'bg-base/5 text-maroon border-maroon/20 hover:bg-base/10'
              }`}
            >
              {m}{m === method ? "" : ""}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePay}
          disabled={paying || !method}
          className="w-full py-3 rounded-full bg-maroon text-cream font-medium shadow-md hover:bg-maroon/90 transition-all disabled:opacity-50 cursor-pointer text-sm"
        >
          {paying ? "Processing..." : `Confirm`}
        </button>
      </div>
    </div>
  )
}

export default PaymentPage;
