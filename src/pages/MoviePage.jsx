import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getDateOptions, getAvailableShowtimes, CINEMAS } from "../lib/constants";
import { getMovieById } from "../services/MovieServices";
import { useBooking } from "../context/BookingContext";

const MoviePage = () => {
    const { updateDraft, cinema, chooseCinema } = useBooking();
    const { id } = useParams();
    const navigate = useNavigate();
    const dateOptions = useMemo(() => getDateOptions(), []);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(dateOptions[0].value);
    const showtimes = getAvailableShowtimes(date);

    useEffect(() => {
        const loadMovie = async () => {
            try {
                const data = await getMovieById(id);
                setMovie(data);
            } catch (error) {
                toast.error("Could not load movie.");
                navigate("/NowShowing");
            } finally {
                setLoading(false);
            }
        };
        loadMovie();
    }, [id]);

    if (loading) return <div className="flex-1 bg-base flex items-center justify-center text-cream/60 text-sm">Loading...</div>;
    if (!movie) return null;

    const director = movie.credits.crew.find((p) => p.job === "Director")?.name;
    const cast = movie.credits.cast.slice(0, 3).map((c) => c.name).join(", ");
    const genres = movie.genres.slice(0, 3).map((g) => g.name);
    const runtime = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;
    const rating = (movie.vote_average / 2).toFixed(1);
    const language = movie.spoken_languages.map((l) => l.english_name).join(", ");
    const trailer = movie.videos.results.find((v) => v.type === "Trailer" && v.site === "YouTube");

    const todayStr = new Date().toISOString().split("T")[0];
    const isComingSoon =
        (movie.status && movie.status !== "Released") ||
        (movie.release_date && movie.release_date > todayStr);

    const handleSelectTime = (time) => {
        updateDraft({
            movieID: id,
            movieTitle: movie.title,
            posterPath: movie.poster_path,
            cinema,
            date,
            time,
            seats: [],
        });
        navigate(`/movie/${id}/seats`);
    };

    const scrollToShowtimes = () => {
        document.getElementById("showtimes")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="flex-1 bg-base text-cream">
            {/* Hero */}
            <section className="relative w-full overflow-hidden">
                <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover object-top opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base via-base/80 to-base/40" />

                <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-10 flex flex-col md:flex-row md:items-end gap-8">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-40 md:w-52 rounded-lg shadow-2xl object-cover mx-auto md:mx-0"
                    />
                    <div className="space-y-4 text-center md:text-left">
                        <span className="text-sm uppercase tracking-widest text-cream/70 font-medium">
                            {isComingSoon ? "Coming Soon" : "Now Showing"}
                        </span>
                        <h1 className="font-heading text-4xl md:text-6xl leading-tight tracking-wide">
                            {movie.title}
                        </h1>
                        <p className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-1 text-cream text-cream/70">
                            <span>{genres.join(", ")}</span>
                            <span>{runtime}</span>
                            <span>★ {rating}</span>
                        </p>
                        {!isComingSoon && (
                            <button
                                onClick={scrollToShowtimes}
                                className="px-6 py-3 rounded-full bg-glow text-cream font-semibold text-sm hover:bg-glow/90 transition-all shadow-lg cursor-pointer"
                            >
                                View showtimes
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Details */}
            <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-8">
                    <div className="space-y-2">
                        <h2 className="font-heading text-xl tracking-wide">Cast</h2>
                        <p className="text-cream text-cream/80">{cast || "N/A"}</p>
                    </div>
                    <div className="space-y-2">
                        <h2 className="font-heading text-xl tracking-wide">Synopsis</h2>
                        <p className="text-cream text-cream/80 leading-loose">{movie.overview || "No synopsis available."}</p>
                    </div>
                    {trailer && (
                        <div className="w-full aspect-video rounded-sm overflow-hidden bg-black/20">
                            <iframe
                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                title="Trailer"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                    )}
                </div>

                <div className="space-y-5">
                    <div>
                        <h3 className="text-cream/70 text-sm">Runtime</h3>
                        <p className="text-cream">{runtime}</p>
                    </div>
                    <div>
                        <h3 className="text-cream/70 text-sm">Release date</h3>
                        <p className="text-cream">{movie.release_date || "TBA"}</p>
                    </div>
                    <div>
                        <h3 className="text-cream/70 text-sm">Director</h3>
                        <p className="text-cream">{director || "N/A"}</p>
                    </div>
                    <div>
                        <h3 className="text-cream/70 text-sm">Language</h3>
                        <p className="text-cream">{language || "N/A"}</p>
                    </div>
                    <div>
                        <h3 className="text-cream/70 text-sm mb-2">Genre</h3>
                        <div className="flex flex-wrap gap-2">
                            {genres.map((g) => (
                                <span key={g} className="px-3 py-1 rounded-full border border-cream/30 text-sm">
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Showtimes */}
            <section id="showtimes" className="max-w-5xl mx-auto px-6 pb-20 space-y-6 scroll-mt-6">
                <h2 className="font-heading text-3xl tracking-wide">Showtimes</h2>

                {isComingSoon ? (
                    <div className="w-full p-8 rounded-2xl bg-maroon/20 border border-maroon/30 text-center space-y-3">
                        <h3 className="font-heading text-2xl text-cream tracking-wide">Coming Soon</h3>
                        <p className="text-cream text-cream/70">
                            This movie has not been released yet. Estimated release date:{" "}
                            <span className="text-cream font-semibold">{movie.release_date || "To be announced"}</span>
                        </p>
                    </div>
                ) : !cinema ? (
                    <div className="space-y-5">
                        <p className="text-cream text-cream/70">Choose a branch to see showtimes.</p>
                        <div className="flex flex-wrap gap-3">
                            {CINEMAS.map((c) => (
                                <button
                                    key={c}
                                    onClick={() => chooseCinema(c)}
                                    className="px-6 py-2.5 rounded-sm border border-cream/30 text-cream transition-colors hover:bg-maroon hover:border-maroon cursor-pointer"
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-cream/10">
                            {dateOptions.map((d) => (
                                <button
                                    key={d.value}
                                    onClick={() => setDate(d.value)}
                                    className={`pb-3 -mb-px text-cream border-b-2 transition-colors cursor-pointer ${
                                        date === d.value
                                            ? "border-cream text-cream"
                                            : "border-transparent text-cream/70 hover:text-cream"
                                    }`}
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>

                        {showtimes.length === 0 ? (
                            <p className="text-cream/70 text-cream">No more showtimes today.</p>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {showtimes.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => handleSelectTime(t)}
                                        className="px-6 py-2.5 rounded-sm border border-cream/30 text-cream transition-colors hover:bg-maroon hover:border-maroon cursor-pointer"
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default MoviePage;
