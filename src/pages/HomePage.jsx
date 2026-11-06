import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getNowShowing, getGenres } from "../services/MovieServices";
import { isReleased } from "../lib/constants";
import { Link } from "react-router-dom";
import { MovieCardSkeleton } from "../components/Skeleton";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const released = movies.filter((m) => isReleased(m.release_date));
  const featuredMovie = released[0];

  const filtered = released.filter((m) => {
    const matchesGenre = activeGenre ? m.genre_ids.includes(activeGenre) : true;
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="flex-1 bg-base text-cream pb-16 space-y-12">
      
      {featuredMovie && !loading && (
        <div className="relative w-full h-[480px] sm:h-[540px] overflow-hidden">
          <img 
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path || featuredMovie.poster_path}`} 
            alt={featuredMovie.title} 
            className="w-full h-full object-cover object-top opacity-40 blur-[1px]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base via-base/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-base via-transparent to-transparent" />

          <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-12 space-y-4">
            <span className="text-sm uppercase tracking-widest text-cream font-medium bg-maroon/80 border border-maroon px-3 py-1 rounded-full w-fit shadow-md">
              Featured Screening
            </span>
            <h1 className="text-4xl sm:text-6xl font-heading tracking-wide text-cream max-w-2xl drop-shadow-md">
              {featuredMovie.title}
            </h1>
            <p className="text-sm text-cream/80 max-w-xl line-clamp-2 leading-relaxed">
              {featuredMovie.overview}
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Link 
                to={`/movie/${featuredMovie.id}`} className="px-6 py-3 rounded-full bg-maroon text-cream font-medium text-base hover:bg-maroon/90 transition-all shadow-lg cursor-pointer" > Get Ticket </Link> <Link to={`/movie/${featuredMovie.id}`}
                className="px-6 py-3 rounded-full bg-cream/10 text-cream hover:bg-cream/20 border border-cream/20 font-medium text-sm transition-all cursor-pointer"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      )}

     
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="font-heading text-3xl tracking-wide text-cream">Now Showing</h2>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>

        
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
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
                <Link to={`/movie/${m.id}`} className="flex flex-col h-full"> <div className="relative aspect-[2/3] bg-base/20 overflow-hidden"> <img src={`https://image.tmdb.org/t/p/w500${m.poster_path}`} 
                      alt={m.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-3 right-3 bg-base/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cream/20 text-sm font-semibold text-cream flex items-center gap-1 shadow-sm">
                      ★ {(m.vote_average / 2).toFixed(1)}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
                    <div>
                      <h3 className="font-heading text-lg text-cream line-clamp-1 tracking-wide">{m.title}</h3>
                      <p className="text-base text-cream/70 mt-1">{m.release_date}</p>
                    </div>

                    <span className="w-full text-center py-2 rounded-xl bg-maroon text-cream font-medium text-base hover:bg-maroon/90 transition-all shadow-sm">
                      Get Ticket
                    </span>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>  
      </div>
    </div>
  );
};

export default HomePage;
