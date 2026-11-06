const Footer = () => {
  return (
    <footer className="border-t border-cream/10 bg-base text-cream">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center gap-2 text-center">
        <span className="font-heading text-lg tracking-wide">Silakbo Cinemas</span>
        <p className="text-sm text-cream/70 max-w-md">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
        <p className="text-xs uppercase tracking-widest text-cream/60 pt-2">
          © {new Date().getFullYear()} Group 5 - AWA | UI-UX Final Project 
        </p>
      </div>
    </footer>
  )
}

export default Footer
