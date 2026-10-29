import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SHOWTIMES } from "../lib/constants";
import { getMovieById } from "../services/MovieServices";

const BookingPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMovie = async () => {
            try {
                const data = await getMovieById(id);
                setMovie(data);
            } catch (error) {
                toast.error("Could not load movie.");
                navigate("/NowShowing")
            } finally {
                setLoading(false);
            }
        };
        loadMovie();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!movie) return null;
    
    const genres = movie.genres.slice(0, 3).map((g) => g.name);
    const runtime = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;
    const rating = (movie.vote_average / 2).toFixed(1);

    return (
        <div>
            <div>
                {genres.map((g) => (
                    <span key={g}>{g}</span>
                ))}
                <span>{runtime}</span>
                <span>★ {rating}</span>
            </div>

            <h1>{movie.title}</h1>
            <p>{movie.overview}</p>

            <div>
                <h3>Details</h3>
                <p>Director: {director || "N/A"}</p>
                <p>Cast: {cast || "N/A"}</p>
                <p>Language: {language || "N/A"}</p>
                <p>Release: {movie.release_date}</p>
            </div>

            {trailer && (
                <iframe 
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                allowFullScreen
                />
            )}

            <div>
                <h3>Showtimes Today</h3>
                {SHOWTIMES.map((t) => (
                    <span key={t}>{t}</span>
                ))}
            </div>

            <button onClick={() => navigate(`/movie/${id}/book`)}>Book tickets</button>
        </div>
    )
}

export default BookingPage;