// localStorage utility functions for Flixster app

const KEYS = {
  FAVORITES: 'flixster_favorites',
  WATCHED: 'flixster_watched',
  GENRES: 'flixster_genres'
};

// Favorites
export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error);
    return [];
  }
};

export const saveFavorites = (favorites) => {
  try {
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

export const addFavorite = (movieId) => {
  const favorites = getFavorites();
  if (!favorites.includes(movieId)) {
    favorites.push(movieId);
    saveFavorites(favorites);
  }
  return favorites;
};

export const removeFavorite = (movieId) => {
  const favorites = getFavorites();
  const updated = favorites.filter(id => id !== movieId);
  saveFavorites(updated);
  return updated;
};

export const isFavorite = (movieId) => {
  const favorites = getFavorites();
  return favorites.includes(movieId);
};

// Watched
export const getWatched = () => {
  try {
    const watched = localStorage.getItem(KEYS.WATCHED);
    return watched ? JSON.parse(watched) : [];
  } catch (error) {
    console.error('Error reading watched from localStorage:', error);
    return [];
  }
};

export const saveWatched = (watched) => {
  try {
    localStorage.setItem(KEYS.WATCHED, JSON.stringify(watched));
  } catch (error) {
    console.error('Error saving watched to localStorage:', error);
  }
};

export const addWatched = (movieId) => {
  const watched = getWatched();
  if (!watched.includes(movieId)) {
    watched.push(movieId);
    saveWatched(watched);
  }
  return watched;
};

export const removeWatched = (movieId) => {
  const watched = getWatched();
  const updated = watched.filter(id => id !== movieId);
  saveWatched(updated);
  return updated;
};

export const isWatched = (movieId) => {
  const watched = getWatched();
  return watched.includes(movieId);
};

// Genres
export const getGenres = () => {
  try {
    const genres = localStorage.getItem(KEYS.GENRES);
    return genres ? JSON.parse(genres) : [];
  } catch (error) {
    console.error('Error reading genres from localStorage:', error);
    return [];
  }
};

export const saveGenres = (genres) => {
  try {
    localStorage.setItem(KEYS.GENRES, JSON.stringify(genres));
  } catch (error) {
    console.error('Error saving genres to localStorage:', error);
  }
};

export const hasCompletedOnboarding = () => {
  return getGenres().length > 0;
};
