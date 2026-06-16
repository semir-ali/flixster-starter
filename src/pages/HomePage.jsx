import { useState, useEffect, memo } from 'react';
import CategorySection from '../components/CategorySection';
import FeaturedMovie from '../components/FeaturedMovie';
import './HomePage.css';

const HomePage = memo(function HomePage({ onMovieClick, favorites, watched, userGenres, onToggleFavorite, onToggleWatched }) {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const GENRE_NAMES = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };

  useEffect(() => {
    const buildSections = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const sectionsConfig = [];

        // 1. Now Playing (required)
        sectionsConfig.push({
          title: 'Now Playing',
          endpoint: `/movie/now_playing`
        });

        // 2. Top Rated (required)
        sectionsConfig.push({
          title: 'Top Rated',
          endpoint: `/movie/top_rated`
        });

        // 3 & 4. Similar to favorited movies
        if (favorites.length >= 2) {
          const randomFavorites = [...favorites].sort(() => Math.random() - 0.5).slice(0, 2);

          for (const movieId of randomFavorites) {
            try {
              const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
              if (movieResponse.ok) {
                const movieData = await movieResponse.json();
                sectionsConfig.push({
                  title: `Similar to ${movieData.title}`,
                  endpoint: `/movie/${movieId}/similar`
                });
              }
            } catch (err) {
              console.error(`Error fetching movie ${movieId}:`, err);
            }
          }
        } else if (favorites.length === 1) {
          try {
            const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${favorites[0]}?api_key=${API_KEY}`);
            if (movieResponse.ok) {
              const movieData = await movieResponse.json();
              sectionsConfig.push({
                title: `Similar to ${movieData.title}`,
                endpoint: `/movie/${favorites[0]}/similar`
              });
            }
          } catch (err) {
            console.error(`Error fetching movie ${favorites[0]}:`, err);
          }
        }

        // 5 & 6. Genre-based sections
        if (userGenres.length >= 2) {
          const selectedGenres = userGenres.slice(0, 2);
          for (const genreId of selectedGenres) {
            sectionsConfig.push({
              title: `${GENRE_NAMES[genreId] || 'Popular'} Movies`,
              endpoint: `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`
            });
          }
        } else if (userGenres.length === 1) {
          sectionsConfig.push({
            title: `${GENRE_NAMES[userGenres[0]] || 'Popular'} Movies`,
            endpoint: `/discover/movie?with_genres=${userGenres[0]}&sort_by=popularity.desc`
          });
        }

        // 7. Because You Watched (if watched movies exist)
        if (watched.length > 0) {
          const randomWatched = watched[Math.floor(Math.random() * watched.length)];
          try {
            const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${randomWatched}?api_key=${API_KEY}`);
            if (movieResponse.ok) {
              const movieData = await movieResponse.json();
              sectionsConfig.push({
                title: `Because You Watched ${movieData.title}`,
                endpoint: `/movie/${randomWatched}/similar`
              });
            }
          } catch (err) {
            console.error(`Error fetching movie ${randomWatched}:`, err);
          }
        }

        // 8. Fill remaining slots with random genres or popular categories
        const remainingSlots = 8 - sectionsConfig.length;
        if (remainingSlots > 0) {
          const randomGenreIds = [28, 35, 27, 878, 10749]; // Action, Comedy, Horror, Sci-Fi, Romance
          const unusedGenres = randomGenreIds.filter(id => !userGenres.includes(id));
          const shuffled = [...unusedGenres].sort(() => Math.random() - 0.5);

          for (let i = 0; i < Math.min(remainingSlots, shuffled.length); i++) {
            const genreId = shuffled[i];
            sectionsConfig.push({
              title: `${GENRE_NAMES[genreId]} Movies`,
              endpoint: `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`
            });
          }

          // If still need more, add "Popular" and "Upcoming"
          if (sectionsConfig.length < 8) {
            sectionsConfig.push({
              title: 'Popular Movies',
              endpoint: `/movie/popular`
            });
          }
          if (sectionsConfig.length < 8) {
            sectionsConfig.push({
              title: 'Upcoming',
              endpoint: `/movie/upcoming`
            });
          }
        }

        // Fetch movies for each section (limit to 8 sections)
        const finalSections = sectionsConfig.slice(0, 8);
        const sectionsData = await Promise.all(
          finalSections.map(async (section) => {
            try {
              const response = await fetch(
                `https://api.themoviedb.org/3${section.endpoint}${section.endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}&page=1`
              );
              if (!response.ok) {
                throw new Error(`Failed to fetch ${section.title}`);
              }
              const data = await response.json();
              return {
                ...section,
                movies: data.results.slice(0, 20) // Limit to 20 movies per section
              };
            } catch (err) {
              console.error(`Error fetching section ${section.title}:`, err);
              return {
                ...section,
                movies: []
              };
            }
          })
        );

        // Deduplicate movies across all sections
        const seenMovieIds = new Set();
        const deduplicatedSections = sectionsData.map(section => {
          const uniqueMovies = section.movies.filter(movie => {
            if (seenMovieIds.has(movie.id)) {
              return false; // Skip duplicate
            }
            seenMovieIds.add(movie.id);
            return true;
          });

          return {
            ...section,
            movies: uniqueMovies
          };
        });

        setSections(deduplicatedSections.filter(section => section.movies.length > 0));
      } catch (err) {
        setError('Failed to load recommendations. Please try again later.');
        console.error('Error building home page sections:', err);
      } finally {
        setIsLoading(false);
      }
    };

    buildSections();
  }, [favorites, watched, userGenres, API_KEY]);

  if (isLoading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Building your personalized recommendations...</p>
      </div>
    );
  }

  if (error) {
    return <div className="home-error">{error}</div>;
  }

  return (
    <div className="home-page">
      <FeaturedMovie onMovieClick={onMovieClick} />

      <div className="home-header">
        <h1 className="home-title">Discover Movies</h1>
        <p className="home-subtitle">Personalized recommendations just for you</p>
      </div>

      {sections.map((section, index) => (
        <CategorySection
          key={`${section.title}-${index}`}
          title={section.title}
          movies={section.movies}
          onMovieClick={onMovieClick}
          favorites={favorites}
          watched={watched}
          onToggleFavorite={onToggleFavorite}
          onToggleWatched={onToggleWatched}
        />
      ))}
    </div>
  );
});

export default HomePage;
