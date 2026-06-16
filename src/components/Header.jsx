import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <span className="logo-text">
            <span className="logo-flix">Flix</span><span className="logo-ster">ster</span>
          </span>
        </Link>
        <nav className="header-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/search"
            className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
          >
            Search
          </Link>
          <Link
            to="/favorites"
            className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
          >
            Favorites
          </Link>
          <Link
            to="/watched"
            className={`nav-link ${location.pathname === '/watched' ? 'active' : ''}`}
          >
            Watched
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
