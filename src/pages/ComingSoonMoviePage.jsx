import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getMovieById } from "../services/MovieServices";

const ComingSoonMoviePage = () => {
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
                navigate("/ComingSoon");
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
    const genres = movie.genres.slice(0, 3).map((g) => g.name).join(", ");
    const runtime = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;
    const rating = (movie.vote_average / 2).toFixed(1);
    const language = movie.spoken_languages.map((l) => l.english_name).join(", ");
    const trailer = movie.videos.results.find((v) => v.type === "Trailer" && v.site === "YouTube");

    const details = [
        ["Director", director],
        ["Cast", cast],
        ["Language", language],
        ["Release date", movie.release_date],
    ];

    return (
        <div className="flex-1 bg-base text-cream">
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
                            <p className="flex flex-wrap gap-x-6 gap-y-1 text-cream text-cream/60">
                                <span>{genres}</span>
                                <span>{runtime}</span>
                                <span>★ {rating}</span>
                            </p>
                        </div>

                        <p className="text-cream leading-loose text-cream max-w-prose">
                            {movie.overview || "No synopsis available."}
                        </p>

                        <dl className="text-cream">
                            {details.map(([label, value]) => (
                                <div
                                    key={label}
                                    className="grid grid-cols-3 gap-4 py-3 border-t border-cream/10 last:border-b"
                                >
                                    <dt className="text-cream/70">{label}</dt>
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

                <section className="max-w-3xl mx-auto">
                    <div className="w-full p-8 rounded-2xl bg-maroon/20 border border-maroon/30 flex flex-col items-center justify-center text-center space-y-3 mx-auto">
                        <h2 className="font-heading text-2xl text-cream tracking-wide">Coming Soon</h2>
                        <p className="text-cream text-cream/70 max-w-md">
                            This movie has not been released yet. <br />Estimated release date:{" "}
                            <span className="text-cream font-semibold">{movie.release_date || "To be announced"}</span>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ComingSoonMoviePage;
