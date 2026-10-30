import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

const emptyDraft = {
  movieID:  "",
  movieTitle: "",
  posterPath: "",
  cinema: "",
  date: "",
  time: "",
  seats: [],
};

export const BookingProvider = ({ children }) => {
  const [draft, setDraft] = useState(emptyDraft);
  const [cinema, setCinema] = useState(() => localStorage.getItem("cinema") || "");

  const updateDraft = (fields) => {
    setDraft((prev) => ({
      ...prev, ...fields
    }))
  };

  const resetDraft = () => {
    setDraft(emptyDraft);
  };

  const chooseCinema = (name) => {
    setCinema(name);
    localStorage.setItem("cinema", name);
    resetDraft();
  };

  const clearCinema = () => {
    setCinema("");
    localStorage.removeItem("cinema");
    resetDraft();
  }

  return (
    <BookingContext.Provider value={{ draft, updateDraft, resetDraft, cinema, chooseCinema, clearCinema }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);

