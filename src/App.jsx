import { useState } from 'react'
import Header from './components/Header'
import MovieList from './components/MovieList'
import MovieModal from './components/MovieModal'
import Footer from './components/Footer'
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
      <Header />
      <main>
        <MovieList onMovieClick={handleMovieClick} />
      </main>
      <Footer />
      {selectedMovieId && (
        <MovieModal movieId={selectedMovieId} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default App
