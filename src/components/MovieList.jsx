import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import LoadMoreButton from './LoadMoreButton';
import SearchBar from './SearchBar';
import SortDropdown from './SortDropdown';
import './MovieList.css';

function MovieList({ onMovieClick }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState('now_playing'); // 'now_playing' or 'search'
  const [sortOption, setSortOption] = useState('title');

  const API_KEY = import.meta.env.VITE_API_KEY;
  const AI_API_KEY = import.meta.env.AI_API_KEY;

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

      // Append new movies to existing list (not replace)
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

      // Append new movies to existing list (not replace)
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
    // Fetch first page when component mounts
    fetchNowPlaying(1);
  }, []); // Empty dependency array - runs once on mount

  const handleLoadMore = () => {
    if (mode === 'now_playing') {
      fetchNowPlaying(currentPage + 1);
    } else {
      fetchSearchResults(currentPage + 1);
    }
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) {
      // If search is empty, return to Now Playing
      handleClearSearch();
      return;
    }

    // Reset state and switch to search mode
    setMovies([]);
    setCurrentPage(1);
    setMode('search');
    fetchSearchResults(1);
  };

  const handleClearSearch = () => {
    // Reset to Now Playing mode
    setSearchQuery('');
    setMovies([]);
    setCurrentPage(1);
    setMode('now_playing');
    fetchNowPlaying(1);
  };

  // Sort movies based on current sortOption
  const getSortedMovies = () => {
    // Remove duplicates: keep only the first occurrence of each movie ID
    const uniqueMovies = movies.filter((movie, index) => {
      // Check if this is the first time we're seeing this movie ID
      const firstIndex = movies.findIndex(m => m.id === movie.id);
      return index === firstIndex;
    });

    // Filter out movies with missing essential information
    const validMovies = uniqueMovies.filter(movie => {
      return (
        movie.poster_path &&        // Must have a poster image
        movie.title &&              // Must have a title
        movie.vote_average != null && // Must have a rating
        movie.release_date          // Must have a release date
      );
    });

    switch (sortOption) {
      case 'title':
        return validMovies.sort((a, b) => a.title.localeCompare(b.title));

      case 'release_date':
        return validMovies.sort((a, b) => {
          // Newest first (descending order)
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
}

export default MovieList;
