import { useEffect, useState } from "react"
import { Navigate, useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { getTakenSeats, updateBooking } from "../services/CinemaServices"
import { SEAT_ROWS, SEATS_PER_ROW, getTotal } from "../lib/constants"
import { useAuth } from "../context/AuthContext"

const seatNumbers = Array.from({length: SEATS_PER_ROW}, (_, i) => i + 1);

const EditSeatsPage = () => {
  const { state: booking } = useLocation()
  const location = useLocation();
  const navigate = useNavigate()
  const {user} = useAuth();
  const [takenSeats, setTakenSeats] = useState([])
  const [selected, setSelected] = useState(booking ? booking.seats : [])   
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!booking) return
    const load = async () => {
      try {
        const data = await getTakenSeats(booking.movieID, booking.cinema, booking.date, booking.time, booking.id)
        setTakenSeats(data)
      } catch (error) {
        toast.error("Could not load seats.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [booking])

  if (!booking) return <Navigate to="/my-tickets" />
  if (loading) return <p>Loading...</p>
  if (!user) return <Navigate to="/LoginPage" state={{ from: location }} />

  const toggleSeat = (seatId) => {
        if (takenSeats.includes(seatId)) return;
        if (selected.includes(seatId)) {
            setSelected(selected.filter((s) => s !== seatId));
        } else {
            setSelected([...selected, seatId])
        }
    }

  const handleSave = async () => {
    if (selected.length === 0) return toast.error("Please select at least one seat.")

    const result = await updateBooking(
      booking.id, booking.movieID, booking.cinema, booking.date, booking.time,
      selected, getTotal(selected.length)
    )

    if (!result.success) return toast.error(result.message)
    toast.success(result.message)
    navigate("/my-tickets")
  }

  return (
      <div>
        <h1>{booking.movieTitle}</h1>
        <p>{booking.cinema} · {booking.date} · {booking.time} </p>
  
        {SEAT_ROWS.map((row) => (
          <div key={row}>
              <span>{row}</span>
              {seatNumbers.map((n) => {
                  const seatId = `${row}${n}`;
                  const isTaken = takenSeats.includes(seatId);
                  const isSelected = selected.includes(seatId);
  
                  return (
                      <button
                      key={seatId}
                      disabled={isTaken}
                      onClick={() => toggleSeat(seatId)}>
                          {seatId}{isSelected ? " ✓": ""}
                      </button>
                  )
              })}
          </div>
        ))}
  
        <p>Seats: {selected.length > 0 ? selected.join(", ") : "None selected"}</p>
        <p>Tickets: {selected.length}</p>
        <p>Total: ₱{getTotal(selected.length)}</p>
        <button onClick={handleSave}>Save Seats</button>
      </div>
    )
}

export default EditSeatsPage;