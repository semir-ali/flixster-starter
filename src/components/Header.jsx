import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">Flixster</span>
        </Link>
        <nav className="header-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            Home
          </Link>
          <Link
            to="/search"
            className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
          >
            <span className="nav-icon">🔍</span>
            Search
          </Link>
          <Link
            to="/favorites"
            className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
          >
            <span className="nav-icon">❤️</span>
            Favorites
          </Link>
          <Link
            to="/watched"
            className={`nav-link ${location.pathname === '/watched' ? 'active' : ''}`}
          >
            <span className="nav-icon">✓</span>
            Watched
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
