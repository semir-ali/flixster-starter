import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import '../components/MovieList.css';
import './FavoritesPage.css';

function WatchedPage({ onMovieClick, favorites, watched, onToggleFavorite, onToggleWatched }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      if (watched.length === 0) {
        setMovies([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const moviePromises = watched.map(movieId =>
          fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
            .then(res => {
              if (!res.ok) throw new Error(`Failed to fetch movie ${movieId}`);
              return res.json();
            })
            .catch(err => {
              console.error(`Error fetching movie ${movieId}:`, err);
              return null;
            })
        );

        const results = await Promise.all(moviePromises);
        const validMovies = results.filter(movie => movie !== null);
        setMovies(validMovies);
      } catch (err) {
        setError('Failed to load watched movies.');
        console.error('Error fetching watched:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchedMovies();
  }, [watched, API_KEY]);

  if (watched.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">✓</div>
        <h2 className="empty-state-title">No Watched Movies Yet</h2>
        <p className="empty-state-message">
          You haven't marked any movies as watched yet. Click the checkmark on any movie to add it!
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="movie-list-error">{error}</div>;
  }

  if (isLoading) {
    return <div className="movie-list-loading">Loading watched movies...</div>;
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Watched Movies</h1>
        <p className="page-subtitle">{movies.length} {movies.length === 1 ? 'movie' : 'movies'}</p>
      </div>

      <div className="movie-list">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => onMovieClick(movie.id)}
            isFavorited={favorites.includes(movie.id)}
            isWatched={watched.includes(movie.id)}
            onToggleFavorite={onToggleFavorite}
            onToggleWatched={onToggleWatched}
          />
        ))}
      </div>
    </>
  );
}

export default WatchedPage;
