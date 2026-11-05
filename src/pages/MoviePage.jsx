import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getDateOptions, getAvailableShowtimes } from "../lib/constants";
import { getMovieById } from "../services/MovieServices";
import { useBooking } from "../context/BookingContext";

const MoviePage = () => {
    const { updateDraft, cinema } = useBooking();
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

    if (loading) return <div className="min-h-screen bg-base flex items-center justify-center text-cream/60 text-sm">Loading...</div>;
    if (!movie) return null;

    const director = movie.credits.crew.find((p) => p.job === "Director")?.name;
    const cast = movie.credits.cast.slice(0, 3).map((c) => c.name).join(", ");
    const genres = movie.genres.slice(0, 3).map((g) => g.name).join(", ");
    const runtime = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;
    const rating = (movie.vote_average / 2).toFixed(1);
    const language = movie.spoken_languages.map((l) => l.english_name).join(", ");
    const trailer = movie.videos.results.find((v) => v.type === "Trailer" && v.site === "YouTube");

    
    const todayStr = new Date().toISOString().split("T")[0];
    const isComingSoon = movie.release_date && movie.release_date > todayStr;

    const details = [
        ["Director", director],
        ["Cast", cast],
        ["Language", language],
        ["Release date", movie.release_date],
    ];

    const handleSelectTime = (time) => {
        if (isComingSoon) return;
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

    return (
        <div className="min-h-screen bg-base text-cream">
            <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-20">

               
                <section className="grid md:grid-cols-5 gap-10 md:gap-16 items-start">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full max-w-xs mx-auto md:max-w-none md:col-span-2 rounded-sm object-cover md:sticky md:top-12"
                    />

                    <div className="md:col-span-3 space-y-10">
                        <div className="space-y-4">
                            <h1 className="font-heading text-4xl md:text-6xl leading-tight tracking-wide">
                                {movie.title}
                            </h1>
                            <p className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-cream/60">
                                <span>{genres}</span>
                                <span>{runtime}</span>
                                <span>★ {rating}</span>
                            </p>
                        </div>

                        <p className="text-cream leading-loose text-sm md:text-[1rem] max-w-prose">
    {movie.overview || "No synopsis available."}
</p>

                        <dl className="text-sm">
                            {details.map(([label, value]) => (
                                <div
                                    key={label}
                                    className="grid grid-cols-3 gap-4 py-3 border-t border-cream/10 last:border-b"
                                >
                                    <dt className="text-cream/50">{label}</dt>
                                    <dd className="col-span-2">{value || "N/A"}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

               
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

               
                <section className="space-y-10 max-w-3xl mx-auto">
                    {isComingSoon ? (
                        <div className="w-full p-8 rounded-2xl bg-maroon/20 border border-maroon/30 flex flex-col items-center justify-center text-center space-y-3 mx-auto">
                            <h3 className="font-heading text-2xl text-cream tracking-wide">Coming Soon</h3>
                            <p className="text-sm text-cream/70 max-w-md">
                                This movie has not been released yet. Showtimes and ticket bookings will be available once it hits theaters.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-5">
                                <h2 className="font-heading text-2xl tracking-wide">Date</h2>
                                <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-cream/10">
                                    {dateOptions.map((d) => (
                                        <button
                                            key={d.value}
                                            onClick={() => setDate(d.value)}
                                            className={`pb-3 -mb-px text-sm border-b-2 transition-colors cursor-pointer ${
                                                date === d.value
                                                    ? "border-cream text-cream"
                                                    : "border-transparent text-cream/50 hover:text-cream"
                                            }`}
                                        >
                                            {d.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-5">
                                <h2 className="font-heading text-2xl tracking-wide">Showtimes</h2>
                                {showtimes.length === 0 ? (
                                    <p className="text-cream/50 text-sm">No more showtimes today.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-3">
                                        {showtimes.map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => handleSelectTime(t)}
                                                className="px-6 py-2.5 rounded-sm border border-cream/30 text-sm transition-colors hover:bg-maroon hover:border-maroon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream cursor-pointer"
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default MoviePage;
