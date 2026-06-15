import { useEffect, useState } from 'react';
import './MovieModal.css';

function MovieModal({ movieId, onClose }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetails = async () => {
      setIsLoadingDetails(true);
      setDetailsError(null);

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMovieDetails(data);
      } catch (err) {
        setDetailsError('Failed to load movie details. Please try again.');
        console.error('Error fetching movie details:', err);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchMovieDetails();
  }, [movieId, API_KEY]);

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

  if (!movieId) return null;

  // Click backdrop to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const backdropUrl = movieDetails?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`
    : null;

  const formatRuntime = (minutes) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {isLoadingDetails ? (
          <div className="modal-loading">Loading movie details...</div>
        ) : detailsError ? (
          <div className="modal-error">
            <p>{detailsError}</p>
            <button onClick={onClose} className="modal-error-close">Close</button>
          </div>
        ) : movieDetails ? (
          <>
            {backdropUrl && (
              <div className="modal-backdrop-image">
                <img src={backdropUrl} alt={`${movieDetails.title} backdrop`} />
                <div className="modal-backdrop-overlay"></div>
              </div>
            )}

            <div className="modal-details">
              <h2 className="modal-title">{movieDetails.title}</h2>

              <div className="modal-metadata">
                {movieDetails.release_date && (
                  <span className="modal-date">{formatDate(movieDetails.release_date)}</span>
                )}
                {movieDetails.runtime && (
                  <span className="modal-runtime">{formatRuntime(movieDetails.runtime)}</span>
                )}
              </div>

              {movieDetails.genres && movieDetails.genres.length > 0 ? (
                <div className="modal-genres">
                  {movieDetails.genres.map((genre) => (
                    <span key={genre.id} className="genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="modal-genres-unavailable">Genre information unavailable</p>
              )}

              {movieDetails.overview && (
                <div className="modal-overview">
                  <h3>Overview</h3>
                  <p>{movieDetails.overview}</p>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default MovieModal;
