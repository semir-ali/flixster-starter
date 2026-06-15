import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">Flixster</span>
        </div>
        <nav className="header-nav">
          <a href="#" className="nav-link">
            <span className="nav-icon">🏠</span>
            Home
          </a>
          <a href="#" className="nav-link active">
            <span className="nav-icon">🔍</span>
            Search
          </a>
          <a href="#" className="nav-link">
            <span className="nav-icon">❤️</span>
            Favorites
          </a>
          <a href="#" className="nav-link">
            <span className="nav-icon">✓</span>
            Watched
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
