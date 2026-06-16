import { useState, useEffect } from 'react';
import './FeaturedMovie.css';

function FeaturedMovie({ onMovieClick }) {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      setIsLoading(true);
      try {
        // Fetch popular movies for the hero section
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch featured movies');
        }

        const data = await response.json();

        // Get top 10 movies with backdrops
        const moviesWithBackdrops = data.results
          .filter(movie => movie.backdrop_path)
          .slice(0, 10);

        setFeaturedMovies(moviesWithBackdrops);
      } catch (error) {
        console.error('Error fetching featured movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, [API_KEY]);

  // Auto-advance to the next slide every 6 seconds.
  // Resetting on currentIndex change keeps a full interval after manual navigation.
  useEffect(() => {
    if (featuredMovies.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1
      );
    }, 6000);

    return () => clearInterval(timer);
  }, [currentIndex, featuredMovies.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? featuredMovies.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleKeyDown = (e, direction) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (direction === 'prev') {
        goToPrevious();
      } else {
        goToNext();
      }
    }
  };

  if (isLoading || featuredMovies.length === 0) {
    return null;
  }

  const currentMovie = featuredMovies[currentIndex];
  const backdropUrl = `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`;

  // Truncate overview to ~200 characters
  const truncatedOverview = currentMovie.overview.length > 200
    ? `${currentMovie.overview.substring(0, 200)}...`
    : currentMovie.overview;

  return (
    <div className="featured-hero">
      <div
        className="featured-hero-backdrop"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="featured-hero-overlay"></div>
      </div>

      <div className="featured-hero-content">
        <span className="featured-badge">FEATURED MOVIE</span>
        <h1 className="featured-title">{currentMovie.title}</h1>
        <p className="featured-overview">{truncatedOverview}</p>
        <button
          className="featured-more-info-btn"
          onClick={() => onMovieClick(currentMovie.id)}
        >
          More Info
        </button>

        <div className="featured-indicators">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <button
        className="featured-nav-btn prev"
        onClick={goToPrevious}
        onKeyDown={(e) => handleKeyDown(e, 'prev')}
        aria-label="Previous movie"
      >
        ‹
      </button>

      <button
        className="featured-nav-btn next"
        onClick={goToNext}
        onKeyDown={(e) => handleKeyDown(e, 'next')}
        aria-label="Next movie"
      >
        ›
      </button>
    </div>
  );
}

export default FeaturedMovie;
