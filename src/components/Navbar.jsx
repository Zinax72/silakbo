import {NavLink} from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { logout } from '../services/AuthServices'
import { toast } from 'react-toastify'
import { useBooking } from '../context/BookingContext'
import logo from '../assets/Silakbo.svg'

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cinema } = useBooking();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/"); // Redirect to the home page after successful logout
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  }

  return (
    <div className="flex justify-end items-center gap-10 p-5 bg-linear-to-b from-maroon via-maroon-deep to-nearblack text-cream text-lg">
        <NavLink to="/" className="mr-auto "><img src={logo} alt="Silakbo Cinemas Logo" className="h-16 w-auto" /></NavLink>
        <NavLink to="/NowShowing" >Now Showing</NavLink>
        <NavLink to="/ComingSoon" >Coming Soon</NavLink>
        
        <NavLink to="/Branch">{cinema ? `Branch: ${cinema}` : "Choose Branch"}</NavLink>

        {user && <NavLink to="/my-tickets">My Tickets</NavLink>}
        {user ? (
          <button
          onClick={handleLogout}
          className="text-gold border border-gold/70 rounded-full px-6 py-2">
            Sign Out
          </button>
        ) : (
          <NavLink to="/LoginPage" 
          className="text-gold border border-gold/70 rounded-full px-6 py-2">
            Sign In
          </NavLink>
        )}
    </div>
  )
}

export default Navbar
