import { useNavigate } from "react-router-dom";
import { CINEMAS } from "../lib/constants";
import { useBooking } from "../context/BookingContext";

const BranchPage = () => {
    const navigate = useNavigate();
    const { chooseCinema } = useBooking();

    return (
        <div className="flex-1 bg-base text-cream px-6 py-12 flex flex-col items-center justify-center">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <span className="text-sm uppercase tracking-widest text-cream/60 font-medium">Silakbo Cinemas</span>
                    <h1 className="font-heading text-3xl sm:text-4xl text-cream tracking-wide">Choose your branch</h1>
                </div>
                <div className="grid gap-3">
                    {CINEMAS.map((c) => (
                        <button
                            key={c}
                            onClick={() => { chooseCinema(c); navigate("/"); }}
                            className="w-full py-4 px-6 rounded-2xl bg-cream text-maroon font-medium shadow-lg hover:bg-maroon hover:text-cream transition-all duration-300 border border-maroon/20 text-sm cursor-pointer"
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BranchPage;
