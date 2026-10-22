export const getMovies = async () => {
    const response = await fetch("/movies.json");
    return await response.json();
};

export const getMovieById = async (id) => {
  const movies = await getMovies();
  return movies.find((m) => m.id === id);
};