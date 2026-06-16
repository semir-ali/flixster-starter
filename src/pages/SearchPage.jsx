import { useState, useEffect, memo } from 'react';
import MovieCard from '../components/MovieCard';
import LoadMoreButton from '../components/LoadMoreButton';
import SearchBar from '../components/SearchBar';
import SortDropdown from '../components/SortDropdown';
import '../components/MovieList.css';

const SearchPage = memo(function SearchPage({ onMovieClick, favorites, watched, onToggleFavorite, onToggleWatched }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState('now_playing');
  const [sortOption, setSortOption] = useState('title');

  const API_KEY = import.meta.env.VITE_API_KEY;

  // Fetch Now Playing movies
  const fetchNowPlaying = async (page) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setMovies(prevMovies => [...prevMovies, ...data.results]);
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load movies. Check your connection.');
      console.error('Error fetching movies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Search results
  const fetchSearchResults = async (page) => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.results.length === 0 && page === 1) {
        setError(`No movies found for "${searchQuery}"`);
        setMovies([]);
        return;
      }

      setMovies(prevMovies => [...prevMovies, ...data.results]);
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error searching movies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNowPlaying(1);
  }, []);

  const handleLoadMore = () => {
    if (mode === 'now_playing') {
      fetchNowPlaying(currentPage + 1);
    } else {
      fetchSearchResults(currentPage + 1);
    }
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) {
      handleClearSearch();
      return;
    }

    setMovies([]);
    setCurrentPage(1);
    setMode('search');
    fetchSearchResults(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setMovies([]);
    setCurrentPage(1);
    setMode('now_playing');
    fetchNowPlaying(1);
  };

  // Sort movies based on current sortOption
  const getSortedMovies = () => {
    const uniqueMovies = movies.filter((movie, index) => {
      const firstIndex = movies.findIndex(m => m.id === movie.id);
      return index === firstIndex;
    });

    const validMovies = uniqueMovies.filter(movie => {
      return (
        movie.poster_path &&
        movie.title &&
        movie.vote_average != null &&
        movie.release_date
      );
    });

    switch (sortOption) {
      case 'title':
        return validMovies.sort((a, b) => a.title.localeCompare(b.title));

      case 'release_date':
        return validMovies.sort((a, b) => {
          const dateA = new Date(a.release_date);
          const dateB = new Date(b.release_date);
          return dateB - dateA;
        });

      case 'vote_average':
        return validMovies.sort((a, b) => b.vote_average - a.vote_average);

      default:
        return validMovies;
    }
  };

  const sortedMovies = getSortedMovies();

  return (
    <>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
        mode={mode}
      />

      <SortDropdown
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      {error ? (
        <div className="movie-list-error">{error}</div>
      ) : movies.length === 0 && isLoading ? (
        <div className="movie-list-loading">Loading movies...</div>
      ) : (
        <>
          {sortedMovies.length > 0 && (
            <div className="movie-count">
              {sortedMovies.length} {sortedMovies.length === 1 ? 'movie' : 'movies'} found
            </div>
          )}

          <div className="movie-list">
            {sortedMovies.map((movie) => (
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

          <LoadMoreButton
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
            isVisible={currentPage < totalPages}
            remainingCount={totalPages > currentPage ? (totalPages - currentPage) * 20 : 0}
          />
        </>
      )}
    </>
  );
});

export default SearchPage;
