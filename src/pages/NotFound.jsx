import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex-1 bg-base text-cream flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md w-full bg-cream rounded-3xl p-8 border border-maroon/10 shadow-2xl text-maroon">
        <h1 className="font-heading text-3xl mb-2 tracking-wide">404 — Page not found</h1>
        <p className="text-sm text-maroon/70 mb-6">The page you're looking for doesn't exist.</p>
        <Link 
          to="/" 
          className="inline-block w-full py-3 rounded-full bg-maroon text-cream text-sm font-medium shadow-md hover:bg-maroon/90 transition-all"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}

export default NotFound;
