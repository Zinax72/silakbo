import { useState } from 'react'
import { Link, useNavigate, Navigate, useLocation} from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { loginSchema } from '../schemas/AuthSchemas'
import { useForm } from 'react-hook-form'
import { login, googleSignIn } from '../services/AuthServices'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/Silakbo.svg'

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (user) return <Navigate to="/" />;

  const from = location.state?.from?.pathname || "/";
  
  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Logged in successfully!");
      reset();
      navigate(from); 
    } catch (error) {
      toast.error("Invalid email or password.");
    }
  }

  const handleGoogle = async () => {
    try {
      await googleSignIn();
      toast.success("Signed in with Google successfully!");
      navigate(from); 
    } catch (error) {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center bg-base bg-radial from-glow/70 to-glow/0 px-6">
        <Helmet>
          <title>Sign in - Silakbo</title>  
        </Helmet>    
        <div className="w-full max-w-sm bg-cream rounded-3xl px-8 py-10 shadow-2xl shadow-black/60 text-center border border-maroon/10">
          <img src={logo} alt="Logo" className="mx-auto mb-2 w-16 h-16" />
          <h1 className="font-heading text-3xl mb-6 text-maroon tracking-[0.12em]">Sign in</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="text-left space-y-4">

            <div className="space-y-1">
              <label className="text-sm text-maroon font-medium">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                {...register("email")}
                className="w-full text-sm text-neutral-900 bg-white placeholder-neutral-600 rounded-xl border border-maroon/25 px-4 py-2.5 focus:outline-none focus:border-maroon"
                />
              {errors.email && (
                <p className="text-sm text-red-700">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm text-maroon font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  {...register("password")}
                  className="w-full text-sm text-neutral-900 bg-white placeholder-neutral-600 font-sans tracking-widest rounded-xl border border-maroon/25 px-4 py-2.5 pr-14 focus:outline-none focus:border-maroon"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-maroon/70 hover:text-maroon cursor-pointer"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-700">{errors.password.message}</p>
              )}
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-maroon py-2.5 text-cream text-sm font-semibold disabled:opacity-50 cursor-pointer hover:bg-maroon/90 transition-all shadow-md mt-2"
            >
              {isSubmitting ? "Logging in..." : "Log in"} 
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="h-px flex-1 bg-maroon/20" />
              <span className="text-sm text-maroon/60">or</span>
              <div className="h-px flex-1 bg-maroon/20" />
            </div>

            <button 
              type="button" 
              onClick={handleGoogle}
              className="w-full rounded-full bg-maroon py-2.5 text-cream text-sm font-semibold hover:bg-maroon/90 transition-all cursor-pointer shadow-md">
                Continue with Google
            </button>
          </form>
          <div className="mt-6 space-y-2 text-sm">
            <Link to="/ForgotPassword" className="text-maroon block mx-auto hover:underline">
              Forgot password?
            </Link>
            <Link to="/RegisterPage" className="text-maroon block hover:underline">New here? Create an account</Link>
          </div>
        </div>
    </div>
  )
}

export default LoginPage;
