import React, { useState } from "react";
import silakboLogo from "../assets/Silakbo.svg";
import "./NowShowing.css";

const CATEGORIES = ["All", "Action", "Animation", "Horror", "Sports", "Epic"];

const DEFAULT_NOW_SHOWING = [
  { id: "1", title: "Spider-Man", duration: "2h 15m", genre: "Action", rating: 4.8, gradient: "card-gradient-red" },
  { id: "2", title: "The Odyssey", duration: "2h 40m", genre: "Epic", rating: 4.6, gradient: "card-gradient-gold" },
  { id: "3", title: "Moana", duration: "1h 55m", genre: "Animation", rating: 4.7, gradient: "card-gradient-teal" },
  { id: "4", title: "Blue Lock", duration: "2h 05m", genre: "Sports", rating: 4.5, gradient: "card-gradient-blue" },
  { id: "5", title: "Rosario", duration: "1h 50m", genre: "Drama", rating: 4.4, gradient: "card-gradient-maroon" },
];

const NowShowing = ({ movies = [], loading }) => {
  const [activeTab, setActiveTab] = useState("All");

  const displayMovies = movies.length > 0
    ? movies.filter((m) => m.status === "now_showing" || !m.status)
    : DEFAULT_NOW_SHOWING;

  const filteredMovies = activeTab === "All"
    ? displayMovies
    : displayMovies.filter((m) => m.genre?.toLowerCase() === activeTab.toLowerCase());

  return (
    <>
      <section className="now-showing-container" id="now-showing">
        <div className="section-header">
          <h2>Now showing</h2>
          <a href="#view-all" className="view-all-link">View all</a>
        </div>

        <div className="filter-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${activeTab === cat ? "active" : ""}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">Loading movies...</div>
        ) : (
          <div className="movie-grid">
            {filteredMovies.map((movie, idx) => {
              const fallbackStyle = DEFAULT_NOW_SHOWING[idx % DEFAULT_NOW_SHOWING.length];
              const cardBg = movie.gradient || fallbackStyle.gradient;

              return (
                <div key={movie.id || idx} className={`movie-card ${cardBg}`}>
                  {movie.poster ? (
                    <img src={movie.poster} alt={movie.title} className="poster-img" />
                  ) : null}

                  <div className="rating-badge">
                    <span className="star">★</span> {movie.rating || "4.5"}
                  </div>

                  <div className="card-overlay">
                    <span className="genre-pill">{movie.genre}</span>
                    <h3 className="movie-title">{movie.title}</h3>
                    <p className="movie-duration">{movie.duration}</p>
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

export default NowShowing;
