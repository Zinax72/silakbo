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
  limitToFirst,
} from "firebase/database";
import { db } from "../lib/firebase";

const bookingsReferences = ref(db, "bookings");

const isBookingEmpty = (booking) => {
    const { uid, movieID, date, time, seats, totalPrice } = booking;
    return  !uid || !movieID || !data || !time || seats.length === 0 || !totalPrice;
}