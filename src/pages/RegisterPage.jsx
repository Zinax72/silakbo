import { Link, Navigate, useNavigate, useLocation} from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { registerSchema } from '../schemas/AuthSchemas';
import { useForm } from 'react-hook-form';
import { register as registerUser, googleSignIn } from '../services/AuthServices';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/Silakbo.svg';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const { register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting},
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  if (user) return <Navigate to="/" />;

  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (data) => {
    try {
      await registerUser(data.email, data.password, data.fullName);
      toast.success("Account created successfully!");
      reset();
      navigate(from); 
    } catch (error) {
      toast.error("Email is already in use.");
    }
  };  

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
    <div className="min-h-screen flex-1 flex justify-center items-center bg-base bg-radial from-glow/70 to-glow/0 px-6 py-12">
        <Helmet>
          <title>Register - Silakbo</title>  
        </Helmet>          
        <div className="w-full max-w-sm bg-cream rounded-3xl px-8 py-10 shadow-2xl shadow-black/60 text-center border border-maroon/10">
          <img src={logo} alt="Logo" className="mx-auto mb-2 w-16 h-16" />
          <h1 className="font-heading text-3xl mb-6 text-maroon tracking-[0.12em]">Create Account</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="text-left space-y-3.5">

            <div className="space-y-1">
              <label className="text-xs text-maroon font-medium">Full Name</label>
              <input
                type="text"
                placeholder="Juan Dela Cruz"
                {...register("fullName")}
                className="w-full text-xs text-neutral-900 bg-white placeholder-neutral-400 rounded-xl border border-maroon/20 px-4 py-2.5 focus:outline-none focus:border-maroon"
              />
              {errors.fullName && (
                <p className="text-xs text-red-700 mt-0.5">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-maroon font-medium">Email</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                {...register("email")}
                className="w-full text-xs text-neutral-900 bg-white placeholder-neutral-400 rounded-xl border border-maroon/20 px-4 py-2.5 focus:outline-none focus:border-maroon"
              />
              {errors.email && (
                <p className="text-xs text-red-700 mt-0.5">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-maroon font-medium">Password</label>
              <input
                type="password"
                placeholder="********"
                {...register("password")}
                className="w-full text-xs text-neutral-900 bg-white placeholder-neutral-400 font-sans tracking-widest rounded-xl border border-maroon/20 px-4 py-2.5 focus:outline-none focus:border-maroon"
              />
              {errors.password && (
                <p className="text-xs text-red-700 mt-0.5">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-maroon font-medium">Confirm Password</label>
              <input
                type="password"
                placeholder="********"
                {...register("confirmPassword")}
                className="w-full text-xs text-neutral-900 bg-white placeholder-neutral-400 font-sans tracking-widest rounded-xl border border-maroon/20 px-4 py-2.5 focus:outline-none focus:border-maroon"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-700 mt-0.5">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-maroon py-2.5 text-cream text-xs font-semibold shadow-md disabled:opacity-50 mt-2 hover:bg-maroon/90 transition-all cursor-pointer"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"} 
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="h-px flex-1 bg-maroon/20" />
              <span className="text-xs text-maroon/60">or</span>
              <div className="h-px flex-1 bg-maroon/20" />
            </div>

            <button 
              type="button" 
              onClick={handleGoogle}
              className="w-full rounded-full bg-maroon py-2.5 text-cream text-xs font-semibold hover:bg-maroon/90 transition-all cursor-pointer shadow-md"
            >
              Continue with Google
            </button>
          </form>
          <div className="mt-6 text-xs">
            <Link to="/LoginPage" className="text-maroon hover:underline">Already have an account? Log in</Link>
          </div>
        </div>
    </div>
  )
}

export default RegisterPage;
