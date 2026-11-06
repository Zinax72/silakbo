import { useEffect, useState } from "react"
import { Navigate, useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"
import { getBookings, deleteBooking } from "../services/CinemaServices"
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

  const tabs = [
    { key: "upcoming", label: "Upcoming", count: upcoming.length },
    { key: "past", label: "Past", count: past.length },
  ]

  return (
    <div className="flex-1 bg-base text-cream">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 space-y-10">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-4xl md:text-5xl tracking-wide">My Tickets</h1>
          <p className="text-sm text-cream/70">Manage your active reservations and view past screenings.</p>
        </div>

       
        <div className="flex justify-center gap-3 border-b border-cream/10 pb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border ${
                tab === t.key
                  ? "bg-cream text-maroon border-cream shadow-md font-semibold"
                  : "bg-transparent text-cream border-cream/30 hover:bg-cream/10 hover:border-cream/60"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-cream/50 py-16 text-center text-sm">Loading tickets...</p>
        ) : shown.length === 0 ? (
          <p className="text-cream/50 py-16 text-center text-sm">No {tab} tickets found.</p>
        ) : (
          <div className="grid gap-6">
            {shown.map((b) => (
              <div
                key={b.id}
                className="bg-cream/10 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-cream/15 flex flex-col sm:flex-row gap-6 items-center justify-between transition-all hover:border-cream/30"
              >
                <div className="flex flex-col sm:flex-row gap-5 items-center w-full sm:w-auto text-center sm:text-left">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${b.posterPath}`}
                    alt={b.movieTitle}
                    className="w-20 h-28 object-cover rounded-xl shadow-md flex-shrink-0"
                  />
                  <div className="space-y-1.5 text-sm">
                    <h2 className="font-heading text-lg tracking-wide text-cream">{b.movieTitle}</h2>
                    <p className="flex flex-wrap justify-center sm:justify-start gap-x-3 text-cream/70">
                      <span>{b.cinema}</span>
                      <span>·</span>
                      <span>{b.date}</span>
                      <span>·</span>
                      <span>{b.time}</span>
                    </p>
                    <p className="text-cream/90">
                      <span className="text-cream/60">Seats: </span>
                      <span className="font-semibold">{b.seats.join(", ")}</span>
                    </p>
                    <p className="text-xs text-cream/40 uppercase tracking-widest pt-1">Ref: {b.ref}</p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-col gap-2.5 w-full sm:w-auto justify-center">
                  <button
                    onClick={() => handleView(b)}
                    className="px-5 py-2.5 rounded-full bg-maroon text-cream text-sm font-medium shadow-md hover:bg-maroon/90 transition-all cursor-pointer"
                  >
                    View ticket
                  </button>
                  {tab === "upcoming" && (
                    <div className="flex gap-2 w-full sm:w-auto justify-center">
                      <button
                        onClick={() => navigate("/my-tickets/edit", { state: b })}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-cream/10 text-cream text-sm font-medium hover:bg-cream/20 transition-all border border-cream/20 cursor-pointer"
                      >
                        Change seats
                      </button>
                      <button
                        onClick={() => handleCancel(b)}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-red-500/10 text-red-300 text-sm font-medium hover:bg-red-500/20 transition-all border border-red-500/20 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTickets;
