import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import MovieModal from './components/MovieModal';
import Footer from './components/Footer';
import GenreOnboarding from './components/GenreOnboarding';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import WatchedPage from './pages/WatchedPage';
import {
  getFavorites,
  saveFavorites,
  getWatched,
  saveWatched,
  getGenres,
  saveGenres,
  hasCompletedOnboarding
} from './utils/localStorage';
import './App.css';

const App = () => {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [watched, setWatched] = useState([]);
  const [userGenres, setUserGenres] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    setFavorites(getFavorites());
    setWatched(getWatched());
    setUserGenres(getGenres());

    // Show onboarding if not completed
    if (!hasCompletedOnboarding()) {
      setShowOnboarding(true);
    }
  }, []);

  const handleMovieClick = useCallback((movieId) => {
    setSelectedMovieId(movieId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovieId(null);
  }, []);

  const handleToggleFavorite = useCallback((movieId) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(movieId)
        ? prevFavorites.filter(id => id !== movieId)
        : [...prevFavorites, movieId];

      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  const handleToggleWatched = useCallback((movieId) => {
    setWatched(prevWatched => {
      const newWatched = prevWatched.includes(movieId)
        ? prevWatched.filter(id => id !== movieId)
        : [...prevWatched, movieId];

      saveWatched(newWatched);
      return newWatched;
    });
  }, []);

  const handleOnboardingComplete = useCallback((selectedGenres) => {
    setUserGenres(selectedGenres);
    saveGenres(selectedGenres);
    setShowOnboarding(false);
  }, []);

  const handleOnboardingSkip = useCallback((defaultGenres) => {
    setUserGenres(defaultGenres);
    saveGenres(defaultGenres);
    setShowOnboarding(false);
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onMovieClick={handleMovieClick}
                  favorites={favorites}
                  watched={watched}
                  userGenres={userGenres}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleWatched={handleToggleWatched}
                />
              }
            />
            <Route
              path="/search"
              element={
                <SearchPage
                  onMovieClick={handleMovieClick}
                  favorites={favorites}
                  watched={watched}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleWatched={handleToggleWatched}
                />
              }
            />
            <Route
              path="/favorites"
              element={
                <FavoritesPage
                  onMovieClick={handleMovieClick}
                  favorites={favorites}
                  watched={watched}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleWatched={handleToggleWatched}
                />
              }
            />
            <Route
              path="/watched"
              element={
                <WatchedPage
                  onMovieClick={handleMovieClick}
                  favorites={favorites}
                  watched={watched}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleWatched={handleToggleWatched}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />

        {selectedMovieId && (
          <MovieModal
            movieId={selectedMovieId}
            onClose={handleCloseModal}
            onMovieClick={handleMovieClick}
          />
        )}

        {showOnboarding && (
          <GenreOnboarding
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
