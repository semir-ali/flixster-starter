import './SearchBar.css';

function SearchBar({ searchQuery, onSearchChange, onSearchSubmit, onClearSearch, mode }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <div className="search-bar">
      <div className="search-header">
        <h2 className="search-title">
          {mode === 'search' && searchQuery ? `Search Results for "${searchQuery}"` : 'Now Playing'}
        </h2>
        {mode === 'search' && (
          <button
            type="button"
            className="now-playing-button"
            onClick={onClearSearch}
          >
            ← Now Playing
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className="search-button">
          Search
        </button>
        {searchQuery && (
          <button
            type="button"
            className="clear-button"
            onClick={onClearSearch}
          >
            Clear
          </button>
        )}
      </form>
    </div>
  );
}

export default SearchBar;
