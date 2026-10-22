import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMovies } from "../services/MovieServices";

const NowShowing = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies()
      .then(setMovies)
      .catch(() => toast.error("Could not load movies."))
      .finally(() => setLoading(false));
  }, []);

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
    </div>
  );
};

export default NowShowing;