const BASE_URL = "https://api.themoviedb.org/3";
const KEY = import.meta.env.VITE_TMDB_KEY;

export const getNowShowing = async () => {
  const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${KEY}&region=PH`);
  if (!response.ok) throw new Error("Failed to load movies");
  const data = await response.json();
  return data.results;
}

export const getComingSoon = async () => {
  const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${KEY}&region=PH`);
  if (!response.ok) throw new Error("Failed to load movies");
  const data = await response.json();
  return data.results;
}

export const getMovieById = async (id) => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${KEY}&append_to_response=credits,videos`
  );
  if (!response.ok) throw new Error("Failed to load movie");
  return await response.json();
}

export const getGenres = async () => {
  const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${KEY}`);
  if (!response.ok) throw new Error("Failed to load genres");
  const data = await response.json();
  return data.genres; 
}