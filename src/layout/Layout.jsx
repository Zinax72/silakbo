import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import Footer from "../components/Footer";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer
      autoClose={200}
      hideProgressBar
      position="top-center" />
    </div>
  )
}

export default Layout
