import { Link } from 'react-router-dom'
import logo from '../assets/Silakbo.svg'

const LoginPage = () => {
  return (
    <div className="flex-1 flex justify-center items-center bg-[#1A0101] bg-radial from-[#A01414B2] to-[#A0141400]">
        <div className="w-110 bg-[#F1E8DC] rounded-3xl p-10 shadow-2xl shadow-black/60 text-center">
          <img src={logo} alt="Logo" className="mx-auto mb-4 w-32 h-32" />
          <h1 className="font-heading text-[#2B0202] text-3xl tracking-[0.12em]">Welcome Back</h1>
          <Link to="/RegisterPage" className="text-sm text-[#2B0202]">New here? Create an account</Link>
        </div>
    </div>
   
  )
}

export default LoginPage