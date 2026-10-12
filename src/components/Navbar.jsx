import {NavLink} from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { logout } from '../services/AuthServices'
import { toast } from 'react-toastify'

const Layout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
    <div className="flex justify-end items-center gap-20 p-5 bg-linear-to-b from-maroon via-maroon-deep to-nearblack text-white text-xl">
        <NavLink to="/" >Home</NavLink>
        <NavLink to="/NowShowing" >Now Showing</NavLink>
        <NavLink to="/ComingSoon" >Coming Soon</NavLink>
        {user ? (
          <button
          onClick={handleLogout}
          className="text-yellow-400 border border-gold/70 rounded-full px-6 py-2">
            Sign Out
          </button>
        ) : (
          <NavLink to="/LoginPage" 
          className="text-yellow-400 border border-gold/70 rounded-full px-6 py-2">
            Sign In
          </NavLink>
        )}
    </div>
  )
}

export default Layout
