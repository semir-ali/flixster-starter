import { useState } from 'react'
import MovieList from './components/MovieList'
import MovieModal from './components/MovieModal'
import './App.css'

const App = () => {
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const handleMovieClick = (movieId) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  return (
    <div className="App">
      <MovieList onMovieClick={handleMovieClick} />
      {selectedMovieId && (
        <MovieModal movieId={selectedMovieId} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default App
