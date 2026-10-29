import { CINEMAS } from "../lib/constants";
import { useBooking } from "../context/BookingContext";

const BranchPage = () => {
    const { chooseCinema } = useBooking();

    return (
        <div>
            <h1>Choose your branch</h1>
            {CINEMAS.map((c) => (
                <button
                key={c}
                onClick={() => chooseCinema(c)}>{c}</button>
            ))}
        </div>
    );
};

export default BranchPage;

