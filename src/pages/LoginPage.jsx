import { Link, useNavigate, Navigate } from 'react-router-dom'
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
  const { user } = useAuth();
  if (user) return <Navigate to="/" />;
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Logged in successfully!");
      reset();
      navigate("/"); // Redirect to the home page after successful login
    } catch (error) {
      toast.error("Invalid email or password.");
    }
  }

  const handleGoogle = async () => {
    try {
      await googleSignIn();
      toast.success("Signed in with Google successfully!");
      navigate("/"); // Redirect to the home page after successful Google sign-in
    } catch (error) {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center bg-base bg-radial from-glow/70 to-glow/0">
        <Helmet>
          <title>Sign in - Silakbo</title>  
        </Helmet>    
            <div className="w-110 bg-cream rounded-3xl px-10 py-8 shadow-2xl shadow-black/60 text-center">
              <img src={logo} alt="Logo" className="mx-auto mb-2 w-20 h-20" />
              <h1 className="font-heading text-3xl mb-4 text-maroon tracking-[0.12em]">Sign in</h1>
              <form onSubmit={handleSubmit(onSubmit)} className="text-left">
    
                <div className="mb-3">
                  <label className="text-md text-maroon">Email</label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    {...register("email")}
                    className="w-full text-md rounded-xl border border-maroon/20 bg-input px-4 py-2"
                    />
                  {errors.email && (
                    <p className="text-sm text-red-700">{errors.email.message}</p>
                  )}
                </div>
    
                <div className="mb-3">
                  <label className="text-md text-maroon">Password</label>
                  <input
                    type="password"
                    placeholder="********"
                    {...register("password")}
                    className="w-full text-md font-sans tracking-widest rounded-xl border border-maroon/20 bg-input px-4 py-2"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-700">{errors.password.message}</p>
                  )}
                </div>
                
                <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-maroon py-2 text-cream disabled:opacity-5"
                >
                  {isSubmitting ? "Logging in..." : "Log in"} 
                </button>
    
                <div className="flex items-center gap-3 my-3">
                  <div className="h-px flex-1 bg-maroon/20" />
                  <span className="text-sm text-maroon/60">or</span>
                  <div className="h-px flex-1 bg-maroon/20" />
                </div>
    
                <button 
                type="button" 
                onClick={handleGoogle}
                className="w-full rounded-full bg-maroon py-2 text-cream">Continue With Google</button>
              </form>
              <Link to="/RegisterPage" className="text-sm text-maroon block mt-4">New here? Create an account</Link>
            </div>
        </div>
   
  )
}

export default LoginPage