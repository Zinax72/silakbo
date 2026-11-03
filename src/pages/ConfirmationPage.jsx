import { useEffect } from "react";
import { Navigate, Link, useLocation } from "react-router-dom"
import { useBooking } from "../context/BookingContext";

const ConfirmationPage = () => {
  const { state } = useLocation();
  const { resetDraft } = useBooking();

  useEffect(() => {
    resetDraft();
  }, [])

  if(!state) return <Navigate to="/NowShowing" />

  const handleDownload = () => {
    const lines = [
      "SILAKBO CINEMAS",
      `Reference: ${state.ref}`,
      `Movie: ${state.movieTitle}`,
      `Branch: ${state.cinema}`,
      `Date: ${state.date} Time: ${state.time}`,
      `Seats: ${state.seats.join(", ")}`,
      `Tickets: ${state.seats.length}`,
      `Total: PHP ${state.totalPrice}`,
      `Payment: ${state.paymentMethod}`,
    ]

    const blob = new Blob([lines.join("\n")], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${state.ref}.txt`
    a.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-base text-cream px-6 py-12 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-cream rounded-3xl p-8 shadow-2xl text-maroon text-center border border-maroon/10">
        <h1 className="font-heading text-3xl mb-2 tracking-wide">Booking Confirmed!</h1>
        <p className="text-xs text-maroon/70 mb-6">Reference: <span className="font-semibold">{state.ref}</span></p>

        <div className="flex flex-col sm:flex-row gap-5 items-center bg-base/5 p-4 rounded-2xl mb-6 text-left border border-maroon/5">
          <img src={`https://image.tmdb.org/t/p/w500${state.posterPath}`} alt={state.movieTitle} className="w-20 h-28 object-cover rounded-xl shadow-md flex-shrink-0" />
          <div className="space-y-1 text-xs opacity-80 w-full">
            <h2 className="font-heading text-lg opacity-100">{state.movieTitle}</h2>
            <p>{state.cinema} · {state.date} · {state.time}</p>
            <p>Seats: <span className="font-semibold">{state.seats.join(", ")}</span></p>
            <p>Paid: <span className="font-semibold">₱{state.totalPrice}</span> ({state.paymentMethod})</p>
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${state.ref}`}
            alt="Booking QR code"
            className="rounded-xl border border-maroon/20 p-2 bg-white shadow-sm"
          />
        </div>

        <button 
          onClick={handleDownload}
          className="w-full py-3 rounded-full bg-maroon text-cream font-medium shadow-md hover:bg-maroon/90 transition-all mb-4 cursor-pointer text-sm"
        >
          Download Ticket
        </button>

        <div className="flex justify-between text-xs font-medium">
          <Link to="/" className="text-maroon hover:underline">Back to home</Link>
          <Link to="/my-tickets" className="text-maroon hover:underline">My tickets</Link> 
        </div>
      </div>
    </div>
  )
}

export default ConfirmationPage;
