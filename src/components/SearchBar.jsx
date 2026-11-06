const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search movies..."
      className="text-sm text-cream bg-nearblack placeholder-cream/40 rounded-xl border border-glow/25 px-4 py-2.5 focus:outline-none focus:border-glow"
    />
  )
}

export default SearchBar
