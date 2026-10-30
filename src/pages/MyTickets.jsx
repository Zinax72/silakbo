import { useEffect, useState } from "react"
import { Navigate, useNavigate, useLocation} from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { getBookings,deleteBooking } from "../services/CinemaServices"
import { isPastShowtime } from "../lib/constants"

const MyTickets = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming")

  useEffect(() => {
    if (!user) return
    const unsubscribe = getBookings(user.uid, (data) => {
      setBookings(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [user])

  if (!user) return <Navigate to="/LoginPage" state={{ from: location }} />

  const upcoming = bookings.filter((b) => !isPastShowtime(b.date, b.time))
  const past = bookings.filter((b) => isPastShowtime(b.date, b.time))
  const shown = tab === "upcoming" ? upcoming : past

  const handleView = (b) => {
    navigate(`/movie/${b.movieID}/confirmation`, { state: b })
  }

  const handleCancel = async (b) => {
    if (!window.confirm(`Cancel booking ${b.ref}? This can't be undone.`)) return
    const result = await deleteBooking(b.id)
    if (result.success) toast.success(result.message)
    else toast.error(result.message)
  }


  return (
    <div>
      <h1>My Tickets</h1>

      <button onClick={() => setTab("upcoming")}>Upcoming ({upcoming.length})</button>
      <button onClick={() => setTab("past")}>Past ({past.length})</button>

      {loading ? (
        <p>Loading...</p>
      ) : shown.length === 0 ? (
        <p>No {tab} tickets.</p>
      ) : (
        shown.map((b) => (
          <div key={b.id}>
            <img src={`https://image.tmdb.org/t/p/w500${b.posterPath}`} alt={b.movieTitle} />
            <p>{b.movieTitle}</p>
            <p>{b.cinema} · {b.date} · {b.time}</p>
            <p>Seats: {b.seats.join(", ")}</p>
            <p>Ref: {b.ref}</p>

            <button onClick={() => handleView(b)}>View ticket</button>
            {tab === "upcoming" && (
              <>
                <button onClick={() => navigate("/my-tickets/edit", { state: b })}>Change seats</button>
                <button onClick={() => handleCancel(b)}>Cancel</button>
              </>
            )}
            
          </div>
        ))
      )}
    </div>
  )
}

export default MyTickets
