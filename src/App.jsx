import { useState } from 'react'
import MovieList from './components/MovieList'
import './App.css'

const App = () => {
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const handleMovieClick = (movieId) => {
    setSelectedMovieId(movieId);
  };

  return (
    <div className="App">
      <MovieList onMovieClick={handleMovieClick} />
    </div>
  )
}

export default App
