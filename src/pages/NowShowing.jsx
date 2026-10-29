import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getNowShowing } from "../services/MovieServices";
import { Link } from "react-router-dom";

const NowShowing = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await getNowShowing();
        setMovies(data);
      } catch (error) {
        toast.error("Could not load movies.");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  return (
    <div>
      <h1>Now Showing</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        movies.map((m) => (
          <div key={m.id}>
            <Link to={`/movie/${m.id}`}>
              <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} alt={m.title} />
              <h2>{m.title}</h2>
              <p>{m.release_date}</p>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default NowShowing;
