import {NavLink} from 'react-router-dom'

const Layout = () => {
  return (
    <div className="flex justify-end items-center gap-20 p-5 bg-linear-to-b from-[#2B0202] via-[#170101] to-[#0D0000] text-white text-xl">
        <NavLink to="/" >Home</NavLink>
        <NavLink to="/NowShowing" >Now Showing</NavLink>
        <NavLink to="/ComingSoon" >Coming Soon</NavLink>
        <NavLink to="/LoginPage" className="text-yellow-400 border border-[#D4B26A]/70 rounded-full px-6 py-2">Sign In</NavLink>

    </div>
  )
}

export default Layout
