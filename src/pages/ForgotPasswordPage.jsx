import { Link, Navigate, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { forgotPasswordSchema } from '../schemas/AuthSchemas'
import { useForm } from 'react-hook-form'
import { resetPassword } from '../services/AuthServices'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/Silakbo.svg'

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  if (user) return <Navigate to="/" />;

  const onSubmit = async (data) => {
    try {
      await resetPassword(data.email);
      toast.success("Reset link sent. Check your email.");
      reset();
      navigate("/LoginPage");
    } catch (error) {
      toast.error("Could not send reset email.");
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center bg-base bg-radial from-glow/70 to-glow/0 px-6 py-12">
      <Helmet>
        <title>Forgot Password - Silakbo</title>
      </Helmet>
      <div className="w-full max-w-sm bg-cream rounded-3xl px-8 py-10 shadow-2xl shadow-black/60 text-center border border-maroon/10">
        <img src={logo} alt="Logo" className="mx-auto mb-2 w-16 h-16" />
        <h1 className="font-heading text-3xl mb-2 text-maroon tracking-[0.12em]">Forgot Password</h1>
        <p className="text-sm text-maroon/70 mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-maroon py-2.5 text-cream text-sm font-semibold disabled:opacity-50 cursor-pointer hover:bg-maroon/90 transition-all shadow-md mt-2"
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <div className="mt-6 text-sm">
          <Link to="/LoginPage" className="text-maroon hover:underline">Back to sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage;
