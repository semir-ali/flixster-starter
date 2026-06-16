import { memo } from 'react';
import './MovieCard.css';

const MovieCard = memo(function MovieCard({ movie, onClick, isFavorited, isWatched, onToggleFavorite, onToggleWatched }) {
  // Construct the poster image URL
  // TMDb base URL + size + poster_path
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(movie.id);
    }
  };

  const handleWatchedClick = (e) => {
    e.stopPropagation();
    if (onToggleWatched) {
      onToggleWatched(movie.id);
    }
  };

  return (
    <div
      className="movie-card"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${movie.title}`}
    >
      <div className="movie-card__poster">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className="movie-card__image"
          />
        ) : (
          <div className="movie-card__placeholder">
            <span>{movie.title}</span>
          </div>
        )}

        {onToggleFavorite && onToggleWatched && (
          <div className="movie-card__actions">
            <button
              className={`action-button favorite-button ${isFavorited ? 'active' : ''}`}
              onClick={handleFavoriteClick}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorited ? '❤️' : '🤍'}
            </button>
            <button
              className={`action-button watched-button ${isWatched ? 'active' : ''}`}
              onClick={handleWatchedClick}
              aria-label={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
              title={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
            >
              {isWatched ? '✓' : '○'}
            </button>
          </div>
        )}

        {isFavorited && (
          <div className="movie-card__badge favorite-badge" aria-label="Favorited">
            ❤️
          </div>
        )}
        {isWatched && (
          <div className="movie-card__badge watched-badge" aria-label="Watched">
            ✓
          </div>
        )}
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title">{movie.title}</h3>
        <div className="movie-card__rating">
          <div className="movie-card__rating-left">
            <span className="rating-star" aria-hidden="true">⭐</span>
            <span className="rating-value" aria-label={`Rating ${movie.vote_average.toFixed(1)} out of 10`}>
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
          {year && <span className="movie-card__year">{year}</span>}
        </div>
      </div>
    </div>
  );
});

export default MovieCard;
