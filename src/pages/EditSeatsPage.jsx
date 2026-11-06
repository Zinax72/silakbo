import { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getTakenSeats, updateBooking } from "../services/CinemaServices";
import { SEAT_ROWS, SEATS_PER_ROW, MAX_SEATS, getTotal } from "../lib/constants";
import { useAuth } from "../context/AuthContext";

const seatNumbers = Array.from({ length: SEATS_PER_ROW }, (_, i) => i + 1);

const EditSeatsPage = () => {
    const { state: booking } = useLocation();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [takenSeats, setTakenSeats] = useState([]);
    const [selected, setSelected] = useState(booking ? booking.seats : []);   
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!booking) return;
        const load = async () => {
            try {
                const data = await getTakenSeats(booking.movieID, booking.cinema, booking.date, booking.time, booking.id);
                setTakenSeats(data);
            } catch (error) {
                toast.error("Could not load seats.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [booking]);

    if (!booking) return <Navigate to="/my-tickets" />;
    if (loading) return <div className="flex-1 bg-base flex items-center justify-center text-cream text-sm">Loading seats...</div>;
    if (!user) return <Navigate to="/LoginPage" state={{ from: location }} />;

    const toggleSeat = (seatId) => {
        if (takenSeats.includes(seatId)) return;
        if (selected.includes(seatId)) {
            setSelected(selected.filter((s) => s !== seatId));
        } else {
            if (selected.length >= MAX_SEATS) {
                toast.error(`You can select up to ${MAX_SEATS} seats.`);
                return;
            }
            setSelected([...selected, seatId]);
        }
    };

    const handleSave = async () => {
        if (selected.length === 0) return toast.error("Please select at least one seat.");

        const result = await updateBooking(
            booking.id, booking.movieID, booking.cinema, booking.date, booking.time,
            selected, getTotal(selected.length)
        );

        if (!result.success) return toast.error(result.message);
        toast.success(result.message);
        navigate("/my-tickets");
    };

    return (
        <div className="flex-1 text-cream px-6 py-10 max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-1">
                <h1 className="font-heading text-2xl sm:text-3xl text-cream tracking-wide">{booking.movieTitle}</h1>
                <p className="text-sm text-cream/70">{booking.cinema} · {booking.date} · {booking.time}</p>
            </div>

            {/* Side-by-Side Container */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                {/* Left Column: Seat Selector Grid */}
                <div className="lg:col-span-3 bg-cream rounded-3xl p-6 sm:p-10 shadow-2xl text-maroon flex flex-col items-center gap-3 overflow-x-auto border border-maroon/10">
                    <div className="w-full max-w-2xl bg-maroon/10 h-3 rounded-full mb-8 text-center text-lg uppercase tracking-widest text-maroon/70 font-semibold leading-3">
                        Screen
                    </div>
                    {SEAT_ROWS.map((row) => (
                        <div key={row} className="flex items-center gap-3">
                            <span className="w-6 text-sm font-bold text-maroon/70 text-center">{row}</span>
                            <div className="flex gap-1.5 sm:gap-2.5">
                                {seatNumbers.map((n) => {
                                    const seatId = `${row}${n}`;
                                    const isTaken = takenSeats.includes(seatId);
                                    const isSelected = selected.includes(seatId);

                                    let btnStyle = "w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl text-sm font-semibold transition-all flex items-center justify-center ";
                                    if (isTaken) btnStyle += "bg-maroon-deep text-[0px] cursor-not-allowed";
                                    else if (isSelected) btnStyle += "bg-glow text-cream shadow-md scale-105 cursor-pointer";
                                    else btnStyle += "bg-base/10 text-maroon hover:bg-maroon/20 cursor-pointer";

                                    return (
                                        <button
                                            key={seatId}
                                            disabled={isTaken}
                                            onClick={() => toggleSeat(seatId)}
                                            className={btnStyle}
                                        >
                                            {n}{isSelected ? "" : ""}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Selected Seats Summary */}
                <div className="lg:col-span-1 bg-cream rounded-3xl p-6 text-maroon shadow-2xl border border-maroon/10 space-y-4 top-6">
                    <h2 className="font-heading text-xl border-b border-maroon/10 pb-3">Update Seats</h2>
                    
                    <div className="text-sm space-y-2 text-maroon/80">
                        <div className="flex justify-between items-start">
                            <span className="opacity-70">Selected Seats:</span>
                            <span className="font-semibold text-maroon text-right max-w-[160px] break-words">
                                {selected.length > 0 ? selected.join(", ") : "None"}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="opacity-70">Total Tickets:</span>
                            <span className="font-semibold text-maroon">{selected.length}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-maroon/10 text-sm font-bold">
                        <span>Total Price</span>
                        <span className="text-lg text-maroon">₱{getTotal(selected.length)}</span>
                    </div>

                    <button 
                        onClick={handleSave}
                        className="w-full py-3 rounded-full bg-maroon text-cream text-sm font-medium shadow-md hover:bg-maroon/90 transition-all cursor-pointer"
                    >
                        Save Seats
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditSeatsPage;
