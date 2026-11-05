import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md w-full bg-neutral-900/40 rounded-3xl p-8 border border-neutral-800 shadow-2xl text-neutral-200">
        <h1 className="font-heading text-2xl mb-2 text-white tracking-tight">404 — Page not found</h1>
        <p className="text-xs text-neutral-400 mb-6">The page you're looking for doesn't exist.</p>
        <Link 
          to="/" 
          className="inline-block w-full py-3 rounded-xl bg-neutral-100 text-neutral-950 text-xs font-semibold shadow-sm hover:bg-neutral-200 transition-all"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}

export default NotFound;
