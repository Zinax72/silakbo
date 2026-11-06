import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { resetPasswordSchema } from "../schemas/AuthSchemas";
import { confirmReset, verifyResetCode } from "../services/AuthServices";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Silakbo.svg";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [checking, setChecking] = useState(Boolean(oobCode));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    const check = async () => {
      if (!oobCode) return;
      try {
        await verifyResetCode(oobCode);
      } catch (error) {
        toast.error("This reset link is invalid or has expired.");
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [oobCode]);

  if (user) return <Navigate to="/" />;

  const onSubmit = async (data) => {
    try {
      await confirmReset(oobCode, data.password);
      toast.success("Password updated. Please sign in.");
      reset();
      navigate("/LoginPage");
    } catch (error) {
      toast.error("Could not reset password. The link may have expired.");
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center bg-base bg-radial from-glow/70 to-glow/0 px-6 py-12">
      <Helmet>
        <title>Reset Password - Silakbo</title>
      </Helmet>
      <div className="w-full max-w-sm bg-cream rounded-3xl px-8 py-10 shadow-2xl shadow-black/60 text-center border border-maroon/10">
        <img src={logo} alt="Logo" className="mx-auto mb-2 w-16 h-16" />
        <h1 className="font-heading text-3xl mb-2 text-maroon tracking-[0.12em]">Reset Password</h1>

        {!oobCode ? (
          <>
            <p className="text-sm text-maroon/70 mb-6">
              Open the reset link we emailed you to choose a new password.
            </p>
            <Link
              to="/ForgotPassword"
              className="block w-full rounded-full bg-maroon py-2.5 text-cream text-sm font-semibold hover:bg-maroon/90 transition-all shadow-md"
            >
              Request a new link
            </Link>
          </>
        ) : checking ? (
          <p className="text-sm text-maroon/70 mb-6">Checking your link…</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="text-left space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-maroon font-medium">New Password</label>
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

            <div className="space-y-1">
              <label className="text-sm text-maroon font-medium">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="********"
                  {...register("confirmPassword")}
                  className="w-full text-sm text-neutral-900 bg-white placeholder-neutral-600 font-sans tracking-widest rounded-xl border border-maroon/25 px-4 py-2.5 pr-14 focus:outline-none focus:border-maroon"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-maroon/70 hover:text-maroon cursor-pointer"
                >
                  {showConfirm ? (
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
              {errors.confirmPassword && (
                <p className="text-sm text-red-700">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-maroon py-2.5 text-cream text-sm font-semibold disabled:opacity-50 cursor-pointer hover:bg-maroon/90 transition-all shadow-md mt-2"
            >
              {isSubmitting ? "Updating..." : "Update password"}
            </button>
          </form>
        )}

        <div className="mt-6 text-sm">
          <Link to="/LoginPage" className="text-maroon hover:underline">Back to sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage;
