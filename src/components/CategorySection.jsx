import { useRef, memo } from 'react';
import MovieCard from './MovieCard';
import './CategorySection.css';

const CategorySection = memo(function CategorySection({ title, movies, onMovieClick, favorites, watched, onToggleFavorite, onToggleWatched }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="category-section">
      <h2 className="category-title">{title}</h2>

      <div className="carousel-container">
        <button
          className="carousel-button left"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          ‹
        </button>

        <div className="carousel-scroll" ref={scrollContainerRef}>
          {movies.map((movie) => (
            <div key={movie.id} className="carousel-item">
              <MovieCard
                movie={movie}
                onClick={() => onMovieClick(movie.id)}
                isFavorited={favorites.includes(movie.id)}
                isWatched={watched.includes(movie.id)}
                onToggleFavorite={onToggleFavorite}
                onToggleWatched={onToggleWatched}
              />
            </div>
          ))}
        </div>

        <button
          className="carousel-button right"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </div>
  );
});

export default CategorySection;
