import { useEffect } from "react";
import { Navigate, Link, useLocation } from "react-router-dom"
import { useBooking } from "../context/BookingContext";

const ConfirmationPage = () => {
  const { state } =  useLocation();
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
      `Date: ${state.date}  Time: ${state.time}`,
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
    <div>
      <h1>Booking confirmed</h1>

      <p>Reference: {state.ref}</p>

      <img src={`https://image.tmdb.org/t/p/w500${state.posterPath}`} alt={state.movieTitle} />
      <p>{state.movieTitle}</p>
      <p>{state.cinema} · {state.date} · {state.time}</p>
      <p>Seats: {state.seats.join(", ")}</p>
      <p>Tickets: {state.seats.length}</p>
      <p>Paid: ₱{state.totalPrice}</p>
      <p>Method: {state.paymentMethod}</p>

      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${state.ref}`}
        alt="Booking QR code"
      />
      <button onClick={handleDownload}>Download Ticket</button>

      <Link to="/">Back to home</Link>
      <Link to="/my-tickets">My tickets</Link> 
    </div>
  )
}

export default ConfirmationPage
