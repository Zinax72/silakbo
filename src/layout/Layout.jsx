import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Outlet />
      <ToastContainer />
    </div>
  )
}

export default Layout
