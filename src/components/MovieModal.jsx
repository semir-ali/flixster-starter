import { useEffect, useState } from 'react';
import './MovieModal.css';

function MovieModal({ movieId, onClose }) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

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

  // Fetch AI insight when movie details are loaded
  useEffect(() => {
    if (!movieDetails) return;

    const getMovieInsight = async () => {
      setIsLoadingInsight(true);

      // Add a small delay to avoid rapid-fire requests when quickly clicking through movies
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        const genres = movieDetails.genres.map(g => g.name).join(', ');

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "openrouter/free",
            messages: [
              {
                role: "system",
                content: "You are an enthusiastic but honest film critic. Write a 2-3 sentence watch recommendation for movies. Be specific about what makes the movie worth watching. Avoid spoilers (even if implicit), generic phrases like 'must-see', and 'I' statements."
              },
              {
                role: "user",
                content: `Movie: ${movieDetails.title}\nGenres: ${genres}\nOverview: ${movieDetails.overview}\n\nWrite a 2-3 sentence watch recommendation.`
              }
            ]
          })
        });

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Rate limit exceeded');
          }
          throw new Error(`OpenRouter error: ${response.status}`);
        }

        const data = await response.json();
        setAiInsight(data.choices[0].message.content);
      } catch (error) {
        console.error("AI insight failed:", error);

        // Show specific message for rate limiting
        if (error.message.includes('429') || error.message.includes('Rate limit')) {
          setAiInsight("AI recommendations temporarily unavailable due to high usage. Please try again in a moment!");
        } else {
          setAiInsight("We couldn't generate a recommendation for this one — check out the overview above!");
        }
      } finally {
        setIsLoadingInsight(false);
      }
    };

    getMovieInsight();
  }, [movieDetails, OPENROUTER_API_KEY]);

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

  // Prevent body scroll when modal is open and cleanup on close
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      // Reset AI state when modal closes
      setAiInsight(null);
      setIsLoadingInsight(false);
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
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
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
              <h2 className="modal-title" id="modal-title">{movieDetails.title}</h2>

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

              {/* AI Recommendation Section */}
              <div className="modal-ai-section">
                <div className="modal-ai-header">
                  <span className="ai-icon">✨</span>
                  <h3>AI Recommendation</h3>
                </div>
                {isLoadingInsight ? (
                  <p className="modal-ai-loading">Getting a recommendation...</p>
                ) : aiInsight ? (
                  <p className="modal-ai-insight">{aiInsight}</p>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default MovieModal;
