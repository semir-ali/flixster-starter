import { useEffect, useState } from 'react';
import './ActorModal.css';

function ActorModal({ actorId, onClose, onMovieClick }) {
  const [actorDetails, setActorDetails] = useState(null);
  const [actorMovies, setActorMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!actorId) return;

    const fetchActorData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch actor details
        const detailsResponse = await fetch(
          `https://api.themoviedb.org/3/person/${actorId}?api_key=${API_KEY}`
        );

        if (!detailsResponse.ok) {
          throw new Error('Failed to fetch actor details');
        }

        const detailsData = await detailsResponse.json();
        setActorDetails(detailsData);

        // Fetch actor's movie credits
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${API_KEY}`
        );

        if (!creditsResponse.ok) {
          throw new Error('Failed to fetch actor movies');
        }

        const creditsData = await creditsResponse.json();

        // Sort by popularity and filter out movies without posters
        const sortedMovies = creditsData.cast
          .filter(movie => movie.poster_path)
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 20); // Top 20 movies

        setActorMovies(sortedMovies);
      } catch (err) {
        setError('Failed to load actor information. Please try again.');
        console.error('Error fetching actor data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActorData();
  }, [actorId, API_KEY]);

  // Handle Escape key press to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!actorId) return null;

  // Click backdrop to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleMovieClick = (movieId) => {
    onClose(); // Close actor modal
    onMovieClick(movieId); // Open movie modal
  };

  return (
    <div
      className="actor-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="actor-modal-title"
    >
      <div className="actor-modal-content">
        <button className="actor-modal-close" onClick={onClose} aria-label="Close actor modal">
          ✕
        </button>

        {isLoading ? (
          <div className="actor-modal-loading">Loading actor information...</div>
        ) : error ? (
          <div className="actor-modal-error">
            <p>{error}</p>
            <button onClick={onClose} className="actor-modal-error-close">Close</button>
          </div>
        ) : actorDetails ? (
          <>
            <div className="actor-modal-header">
              <div className="actor-modal-photo-container">
                {actorDetails.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${actorDetails.profile_path}`}
                    alt={actorDetails.name}
                    className="actor-modal-photo"
                  />
                ) : (
                  <div className="actor-modal-photo-placeholder">
                    <span>👤</span>
                  </div>
                )}
              </div>

              <div className="actor-modal-info">
                <h2 id="actor-modal-title" className="actor-modal-name">{actorDetails.name}</h2>

                {actorDetails.birthday && (
                  <p className="actor-modal-birthday">
                    Born: {new Date(actorDetails.birthday).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {actorDetails.place_of_birth && ` in ${actorDetails.place_of_birth}`}
                  </p>
                )}

                {actorDetails.biography && (
                  <div className="actor-modal-bio">
                    <h3>Biography</h3>
                    <p>{actorDetails.biography.length > 400
                      ? `${actorDetails.biography.substring(0, 400)}...`
                      : actorDetails.biography
                    }</p>
                  </div>
                )}
              </div>
            </div>

            {actorMovies.length > 0 && (
              <div className="actor-modal-filmography">
                <h3>Known For ({actorMovies.length} movies)</h3>
                <div className="actor-movies-grid">
                  {actorMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="actor-movie-card"
                      onClick={() => handleMovieClick(movie.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleMovieClick(movie.id);
                        }
                      }}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                        alt={`${movie.title} poster`}
                        className="actor-movie-poster"
                      />
                      <div className="actor-movie-info">
                        <p className="actor-movie-title">{movie.title}</p>
                        {movie.character && (
                          <p className="actor-movie-character">as {movie.character}</p>
                        )}
                        <div className="actor-movie-meta">
                          {movie.release_date && (
                            <span className="actor-movie-year">
                              {new Date(movie.release_date).getFullYear()}
                            </span>
                          )}
                          <div className="actor-movie-rating">
                            <span className="rating-star">⭐</span>
                            <span className="rating-value">{movie.vote_average.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ActorModal;
