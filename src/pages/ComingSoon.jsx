import React from "react";
import silakboLogo from "../assets/Silakbo.svg";
import "./ComingSoon.css";

const DEFAULT_COMING_SOON = [
  { id: "cs1", title: "The End of Oak Street", genre: "Thriller", releaseDate: "Oct 24", gradient: "card-gradient-slate" },
  { id: "cs2", title: "Title to be announced", genre: "Fantasy", releaseDate: "Nov 07", gradient: "card-gradient-purple" },
  { id: "cs3", title: "Title to be announced", genre: "Horror", releaseDate: "Nov 21", gradient: "card-gradient-darkred" },
];

const ComingSoon = ({ movies = [], loading }) => {
  const comingSoonMovies = movies.filter((m) => m.status === "coming_soon");
  const displayMovies = comingSoonMovies.length > 0 ? comingSoonMovies : DEFAULT_COMING_SOON;

  return (
    <>
      <section className="section-block" id="coming-soon">
        <div className="section-header">
          <h2>Coming soon</h2>
          <a href="#view-all" className="view-all-link">View all</a>
        </div>

        {loading ? (
          <div className="loading-state">Loading movies...</div>
        ) : (
          <div className="movie-grid">
            {displayMovies.map((movie, idx) => {
              const fallbackStyle = DEFAULT_COMING_SOON[idx % DEFAULT_COMING_SOON.length];
              const cardBg = movie.gradient || fallbackStyle.gradient;

              return (
                <div key={movie.id || idx} className={`movie-card ${cardBg}`}>
                  {movie.poster ? (
                    <img src={movie.poster} alt={movie.title} className="poster-img" />
                  ) : null}

                  <div className="card-overlay">
                    <span className="date-pill">{movie.releaseDate || "Upcoming"}</span>
                    <h3 className="movie-title">{movie.title}</h3>
                    <p className="movie-genre">{movie.genre}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="silakbo-footer">
        <div className="footer-left">
          <div className="footer-logo">
            <img src={silakboLogo} alt="Silakbo Cinemas" className="logo-img-footer" />
            <div className="footer-brand">
              <h2>WHERE DREAMS IGNITE</h2>
            </div>
          </div>
        </div>
        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#now-showing">Now showing</a>
          <a href="#coming-soon">Coming soon</a>
        </div>
      </footer>
    </>
  );
};

export default ComingSoon;
