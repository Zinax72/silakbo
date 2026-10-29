import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import { useBooking } from "../context/BookingContext";
import BranchPage from "../pages/BranchPage";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  const {cinema} = useBooking();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {cinema ? <Outlet /> : <BranchPage />}
      <ToastContainer
      autoClose={200}
      hideProgressBar
      position="top-center" />
    </div>
  )
}

export default Layout
