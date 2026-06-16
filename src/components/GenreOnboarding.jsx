import { useState, useEffect } from 'react';
import './GenreOnboarding.css';

const GENRE_LIST = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

function GenreOnboarding({ onComplete, onSkip }) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [error, setError] = useState('');

  const handleGenreToggle = (genreId) => {
    setError('');
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter(id => id !== genreId));
    } else {
      if (selectedGenres.length >= 5) {
        setError('You can select up to 5 genres');
        return;
      }
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const handleSubmit = () => {
    if (selectedGenres.length < 2) {
      setError('Please select at least 2 genres');
      return;
    }
    onComplete(selectedGenres);
  };

  const handleSkip = () => {
    // Select 2 random genres as default
    const shuffled = [...GENRE_LIST].sort(() => Math.random() - 0.5);
    const randomGenres = shuffled.slice(0, 2).map(g => g.id);
    onSkip(randomGenres);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleSkip();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="genre-onboarding-overlay" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <div className="genre-onboarding-modal">
        <div className="onboarding-header">
          <h2 id="onboarding-title" className="onboarding-title">What are your favorite genres?</h2>
          <p className="onboarding-subtitle">Select 2-5 genres to personalize your recommendations</p>
        </div>

        <div className="genre-grid">
          {GENRE_LIST.map((genre) => (
            <button
              key={genre.id}
              className={`genre-chip ${selectedGenres.includes(genre.id) ? 'selected' : ''}`}
              onClick={() => handleGenreToggle(genre.id)}
              aria-pressed={selectedGenres.includes(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {error && <div className="onboarding-error">{error}</div>}

        <div className="onboarding-footer">
          <p className="selection-count">
            {selectedGenres.length} of 5 selected
            {selectedGenres.length >= 2 && ` (${5 - selectedGenres.length} more available)`}
          </p>
          <div className="onboarding-actions">
            <button
              className="onboarding-button secondary"
              onClick={handleSkip}
            >
              Skip for now
            </button>
            <button
              className="onboarding-button primary"
              onClick={handleSubmit}
              disabled={selectedGenres.length < 2}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenreOnboarding;
