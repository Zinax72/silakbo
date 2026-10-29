import {
  ref,
  push,
  get,
  onValue,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { db } from "../lib/firebase";

const bookingsReference = ref(db, "bookings");

// check if booking is empty
const isBookingEmpty = (booking) => {
    const { uid, movieID, cinema, date, time, seats, totalPrice, paymentMethod } = booking;
    return  !uid || !movieID || !cinema || !date || !time || seats.length === 0 || !totalPrice || !paymentMethod;
}


// check if seat is taken
const isSeatTaken = async (movieID, cinema, date, time, seats, excludeId = null) => {
  const seatQuery = query(
    bookingsReference,
    orderByChild("movieID"),
    equalTo(movieID));

  const snapshot = await get(seatQuery);
  let taken = false

  snapshot.forEach((snap) => {
    if (snap.key === excludeId) return;
    const b = snap.val();
    if (b.cinema === cinema && b.date  === date && b.time === time && b.seats.some((s) => seats.includes(s))) {
      taken = true
    }
  });

  return taken;
}

export const getTakenSeats = async (movieID, cinema, date, time, excludeId = null) => {
  const takenQuery = query(
    bookingsReference, 
    orderByChild("movieID"), 
    equalTo(movieID));

  const snapshot = await get(takenQuery);
  const takenSeats = []
  
  snapshot.forEach((snap) => {
    if (snap.key === excludeId) return;
    const b = snap.val();
    if (b.cinema === cinema && b.date === date && b.time === time) {
      takenSeats.push(...b.seats)
    }
  })

  return takenSeats;
}

// unique reference code
const generateRefCode = async () => {
  while (true) {
    const code = "SK-" + Math.random().toString(36).slice(2, 7).toUpperCase();

    const refQuery = query(
      bookingsReference, 
      orderByChild("ref"),
      equalTo(code));
    const snapshot = await get(refQuery);

    if(!snapshot.exists()) return code;
  }
}

// add booking
export const addBooking = async (booking) => {
  try {
    if (isBookingEmpty(booking)) {
      return {
        success: false,
        message: "Please complete all booking details.",
      };
    }

    const { movieID, cinema, date, time, seats } = booking;
    if (await isSeatTaken(movieID, cinema, date, time, seats)) {
      return {
        success: false,
        message: "Seat already taken."
      }
    } 

    const refCode = await generateRefCode();
    await push(bookingsReference, { ...booking, ref: refCode });

    return {
      success: true,
      message: "Booking Successful",
      data: refCode,
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
}

// get bookings
export const getBookings = (uid, callback) => {
  const userQuery = query(
    bookingsReference,
    orderByChild("uid"),
    equalTo(uid),
  );

  const unsubscribe = onValue(userQuery, (snapshot) => {
    const bookingsArray = [];

    snapshot.forEach((snap) => {
      const bookingData = snap.val();
      const id = snap.key;
      const bookingWithId = { id, ...bookingData};
      bookingsArray.push(bookingWithId);
    });
    callback(bookingsArray);
  });

  return unsubscribe
};

export const updateBooking = async (id, movieID, cinema, date, time, seats, totalPrice) => {
  try {
    if (seats.length === 0) {
      return {
        success: false,
        message: "Please select at least one seat."
      }
    }

    if (await isSeatTaken(movieID, cinema, date, time, seats, id)) {
      return {
        success: false,
        message: "Seat taken."
      }
    }

    await update(ref(db, `bookings/${id}`), {date, cinema, time, seats, totalPrice})

    return {
      success: true,
      message: "Updated successfully."
    }
  } catch (error) {
    return {
      success: false,
      message: "Update failed. Please try again."
    }
  }
}

export const deleteBooking = async (id) => {
  try {
    const deleteReference = ref(db, `bookings/${id}`);
    await remove(deleteReference);
    return {
      success: true,
      message: "Deleted successfully."
    }
  } catch (error) {
    return {
      success: false,
      message: "Deletion failed. Please try again."
    }
  }
}
