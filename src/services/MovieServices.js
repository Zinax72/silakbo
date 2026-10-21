export const getMovies = async () => {
    const response = await fetch("/movies.json");
    if (!response.ok) throw new Error("Failed to load movies");
    return await response.json();
};

export const getMovieById = async (id) => {
  const movies = await getMovies();
  return movies.find((m) => m.id === id);
};