import { CINEMAS } from "../lib/constants";
import { useBooking } from "../context/BookingContext";

const BranchPage = () => {
    const { chooseCinema } = useBooking();

    return (
        <diimport { CINEMAS } from "../lib/constants";
import { useBooking } from "../context/BookingContext";

const BranchPage = () => {
    const { chooseCinema } = useBooking();

    return (
        <div className="min-h-screen bg-base text-cream px-6 py-12 flex flex-col items-center justify-center">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <span className="text-xs uppercase tracking-widest text-cream/60 font-medium">Silakbo Cinemas</span>
                    <h1 className="font-heading text-3xl sm:text-4xl text-cream tracking-wide">Choose your branch</h1>
                </div>
                <div className="grid gap-3">
                    {CINEMAS.map((c) => (
                        <button
                            key={c}
                            onClick={() => chooseCinema(c)}
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
