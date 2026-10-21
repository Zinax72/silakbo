import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addBooking,
  getBookings,
  deleteBooking,
  updateBooking,
} from "../services/CinemaServices";
import { getMovies } from "../services/MovieServices";

const HomePage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies()
      .then(setMovies)
      .catch(() => toast.error("Could not load movies."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = getBookings(user.uid, setBookings);
    return () => unsubscribe();
  }, [user]);

  const testAdd = async () => {
    const result = await addBooking({
      uid: user.uid,
      movieID: "1",
      date: "2026-10-25",
      time: "4:30 PM",
      seats: ["E1", "D3"],
      totalPrice: 730,
      paymentMethod: "GCash",
    });
    console.log(result);
  };

  const handleDelete = async (id) => {
    const result = await deleteBooking(id);
    console.log(result);
  };

  const handleUpdate = async (b) => {
    const result = await updateBooking(b.id, b.movieID, b.date, b.time, ["F1", "F2"], b.totalPrice);
    console.log(result);
  };

  return (
    <div>
      <h1>Now Showing</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        movies
          .filter((m) => m.status === "now_showing")
          .map((m) => (
            <div key={m.id}>
              <img src={m.poster} alt={m.title} />
              <h2>{m.title}</h2>
              <p>{m.genre} | {m.duration}</p>
            </div>
          ))
      )}
      <h1>Add</h1>
      <button onClick={testAdd}>Test add</button>

      {bookings.map((b) => (
        <div key={b.id}>
          {b.movieID} | {b.date} | {b.time} | {b.seats.join(", ")} | ₱{b.totalPrice}
          <button onClick={() => handleUpdate(b)}>Change seats</button>
          <button onClick={() => handleDelete(b.id)}>Cancel</button>
        </div>
      ))}
    </div>
  );
};

export default HomePage;