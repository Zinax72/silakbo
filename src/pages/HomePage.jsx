import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  addBooking,
  getBookings,
  deleteBooking,
  updateBooking,
} from "../services/CinemaServices";
import { getMovies } from "../services/MovieServices";
import NowShowing from "./NowShowing";
import ComingSoon from "./ComingSoon";
import silakboLogo from "../assets/Silakbo.svg";
import "./HomePage.css";

const HomePage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies()
      .then((data) => setMovies(data))
      .catch(() => toast.error("Could not load movies."))
      .finally(() => setLoading(false));
  }, []);

   useEffect(() => {
    if (!user) return;
    const unsubscribe = getBookings(user.uid, setBookings);
    return () => unsubscribe();
  }, [user]);

  const testAdd = async () => {
    const result = await addBooking({
      uid: user.uid,
      movieID: "1",
      date: "2026-10-25",
      time: "4:30 PM",
      seats: ["E1", "D3"],
      totalPrice: 730,
      paymentMethod: "GCash",
    });
    console.log(result);
  };

  const handleDelete = async (id) => {
    const result = await deleteBooking(id);
    console.log(result);
  };

  const handleUpdate = async (b) => {
    const result = await updateBooking(b.id, b.movieID, b.date, b.time, ["F1", "F2"], b.totalPrice);
    console.log(result);
  };

  return (
    <div className="silakbo-landing">
      {/* Top Navigation */}
      <nav className="silakbo-nav">
      </nav>

      {/* Hero Banner */}
      <section className="hero-section" id="home">
        <div className="film-strip-border top-strip"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>WHERE DREAMS IGNITE</h1>
            <p>
              Pick a film, choose your seats, and walk in with your ticket
              ready. Every screening at Silakbo Cinemas starts here.
            </p>
            <div className="hero-actions">
              <button className="btn-primary">Buy tickets</button>
              <button className="btn-secondary">See showtimes</button>
            </div>
          </div>
          <div className="hero-logo-large">
            <img src={silakboLogo} alt="Silakbo Cinemas" className="logo-img-hero" />
          </div>
        </div>
        <div className="film-strip-border bottom-strip"></div>
      </section>

      {/* Main Movie Content */}
      <main className="content-container">
        <NowShowing movies={movies} loading={loading} />
        <ComingSoon movies={movies} loading={loading} />
      </main>

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
    </div>
  );
};

export default HomePage;
