import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getDateOptions, getAvailableShowtimes } from "../lib/constants";
import { getMovieById } from "../services/MovieServices";
import { useBooking } from "../context/BookingContext";

const MoviePage = () => {

    const { updateDraft, cinema } = useBooking();
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate ] = useState(getDateOptions()[0].value);
    const showtimes = getAvailableShowtimes(date);
    

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
    const director = movie.credits.crew.find((p) => p.job === "Director")?.name;
    const cast = movie.credits.cast.slice(0, 3).map((c) => c.name).join(", ");
    const genres = movie.genres.slice(0, 3).map((g) => g.name);
    const runtime = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;
    const rating = (movie.vote_average / 2).toFixed(1);
    const language = movie.spoken_languages.map((l) => l.english_name).join(", ")

    const trailer = movie.videos.results.find((v) => v.type === "Trailer" && v.site === "YouTube");

    const handleSelectTime = (time) => {
        updateDraft({
            movieID: id,
            movieTitle: movie.title,
            posterPath:   movie.poster_path,
            cinema,
            date,
            time,
            seats: [],
        });
        navigate(`/movie/${id}/seats`);
    }


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
                <h3>Date</h3>
                {getDateOptions().map((d) => (
                    <button 
                    key={d.value}
                    onClick={() => setDate(d.value)}>{d.label}</button>
                ))}
            </div>

            <div>
                <h3>Showtimes</h3>
                {showtimes.length === 0 ? (
                    <p>No more showtimes today.</p>
                ) : (
                    showtimes.map((t) => (
                        <button 
                        key={t}
                        onClick={() => handleSelectTime(t)}>{t}</button>
                    ))
                )}
            </div>
        </div>
    )
}

export default MoviePage;