import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getComingSoon, getGenres } from "../services/MovieServices";
import { isReleased } from "../lib/constants";
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
    return !isReleased(m.release_date) && matchesGenre && matchesSearch;
  });

  return (
    <div className="flex-1 text-cream px-6 py-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="font-heading text-3xl sm:text-4xl tracking-wide text-cream uppercase">Coming Soon</h1>
        <div className="w-full md:w-80">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </div>

    
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setActiveGenre(null)}
          className={`px-4 py-2 rounded-full text-base font-medium transition-all border cursor-pointer ${
            activeGenre === null
              ? 'bg-cream text-maroon border-cream shadow-md font-semibold'
              : 'bg-transparent text-cream border-cream/30 hover:bg-cream/10 hover:border-cream/60'
          }`}
        >
          All
        </button>
        {genres.map((g) => (
          <button 
            key={g.id} 
            onClick={() => setActiveGenre(g.id)}
            className={`px-4 py-2 rounded-full text-base font-medium transition-all border cursor-pointer ${
              activeGenre === g.id
                ? 'bg-cream text-maroon border-cream shadow-md font-semibold'
                : 'bg-transparent text-cream border-cream/30 hover:bg-cream/10 hover:border-cream/60'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <MovieCardSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <p className="col-span-full text-center text-maroon/60 py-20 text-sm">No movies found.</p>
        ) : (
          filtered.map((m) => (
            <div key={m.id} className="bg-cream/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl border border-cream/15 hover:scale-[1.02] hover:border-cream/30 transition-all duration-300 flex flex-col">
              <Link to={`/movie/${m.id}`} className="flex flex-col h-full">
                <div className="relative aspect-[2/3] bg-base/20 overflow-hidden">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} 
                    alt={m.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-3 right-3 bg-maroon text-cream px-2.5 py-1 rounded-lg border border-cream/20 text-sm uppercase tracking-wider font-semibold shadow-sm">
                    Coming Soon
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
                  <div>
                    <h3 className="font-heading text-lg text-cream line-clamp-1 tracking-wide">{m.title}</h3>
                    <p className="text-base text-cream/70 mt-1">Releases: {m.release_date}</p>
                  </div>

                  <span className="w-full text-center py-2 rounded-xl bg-base/20 text-cream font-medium text-base hover:bg-base/35 transition-all border border-cream/20">
                    View Details
                  </span>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComingSoon;
