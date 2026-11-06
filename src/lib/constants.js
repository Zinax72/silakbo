export const SHOWTIMES = ["8:00 AM", "9:30 AM", "12:30 PM", "1:00 PM", "3:00 PM", "5:30 PM", "8:00 PM"];
export const CINEMAS = [ "Pandi", "Malolos", "Hagonoy", "Marilao", "Meycauayan", "Sta. Maria"];
export const TICKET_PRICE = 500;
export const BOOKING_FEE = 50;
export const SEAT_ROWS = [ "A", "B", "C", "D", "E", "F", "G", "H" ];
export const SEATS_PER_ROW = 12
export const MAX_SEATS = 10

export const getTotal = (seatCount) => {
    return seatCount * (TICKET_PRICE + BOOKING_FEE)
}

const toMinutes = (time) => {
    const [clock, period]  = time.split(" ");
    let [hours, minutes] = clock.split(":").map(Number);
    const isPM = period.toUpperCase() === "PM";

    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;

    return hours * 60 + minutes;
};

export const getAvailableShowtimes = (date) => {
    const now = new Date();
    const today = now.toLocaleDateString("en-CA");

    if (date !== today) return SHOWTIMES;

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    return SHOWTIMES.filter((t) => toMinutes(t) > nowMinutes)
}

export const getDateOptions = () => {
    return [0, 1, 2].map((offset) => {
        const d = new Date(); 
        d.setDate(d.getDate() + offset);
        
        const value = d.toLocaleDateString("en-CA");
        const label = offset === 0 ? "Today" 
                    : offset === 1 ? "Tomorrow"
                    : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric"});
        return { value, label };            
    });
};

export const isPastShowtime = (date, time) => {
  const now = new Date()
  const today = now.toLocaleDateString("en-CA")
  if (date < today) return true
  if (date > today) return false
  return toMinutes(time) < now.getHours() * 60 + now.getMinutes()
}

export const isReleased = (releaseDate) => {
  if (!releaseDate) return false
  return releaseDate <= new Date().toLocaleDateString("en-CA")
}