import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useBooking } from '../context/BookingContext'
import { getTakenSeats } from '../services/CinemaServices'
import { SEAT_ROWS, SEATS_PER_ROW, getTotal } from '../lib/constants'
import { useAuth } from '../context/AuthContext'

const seatNumbers = Array.from({length: SEATS_PER_ROW}, (_, i) => i + 1);

const SeatsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { draft, updateDraft } = useBooking();
    const [takenSeats, setTakenSeats] = useState([]); 
    const [selected, setSelected] = useState(draft.seats);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!draft.movieID) return;

        const loadTaken = async () => {
            try {
                const data = await getTakenSeats(draft.movieID, draft.cinema, draft.date, draft.time)
                setTakenSeats(data);
            } catch (error) {
                toast.error("Could not load seats.");
            } finally {
                setLoading(false);
            }
        };

        loadTaken();
    }, [draft.movieID, draft.cinema, draft.date, draft.time]);

    if (!draft.movieID) return <Navigate to="/NowShowing"/>;
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

    const handleContinue = () => {
        if (selected.length === 0 ) {
            toast.error("Please select at least one seat.");
            return;
        }
        updateDraft({ seats: selected});
        navigate(`/movie/${draft.movieID}/summary`)
    }
  return (
    <div>
      <h1>{draft.movieTitle}</h1>
      <p>{draft.cinema} · {draft.date} · {draft.time} </p>

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
      <button onClick={handleContinue}>Continue</button>
    </div>
  )
}

export default SeatsPage
