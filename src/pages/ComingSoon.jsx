import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getComingSoon, getGenres } from "../services/MovieServices";
import { Link } from "react-router-dom";
import { MovieCardSkeleton } from "../components/Skeleton";
import SearchBar from "../components/SearchBar";

const ComingSoon = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await getComingSoon();
        setMovies(data);
      } catch (error) {
        toast.error("Could not load movies.");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data);
      } catch (error) {
        toast.error("Could not load genres.");
      }
    };

    loadGenres();
  }, []);

  const filtered = movies.filter((m) => {
    const matchesGenre = activeGenre ? m.genre_ids.includes(activeGenre) : true;
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div>
      <h1>Coming Soon</h1>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <div>
        <button onClick={() => setActiveGenre(null)}>All</button>
        {genres.map((g) => (
          <button key={g.id} onClick={() => setActiveGenre(g.id)}>{g.name}</button>
        ))}
      </div>

      {loading ? (
        Array.from({ length: 6 }).map((_, i) => <MovieCardSkeleton key={i} />)
      ) : filtered.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        filtered.map((m) => (
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

export default ComingSoon;
