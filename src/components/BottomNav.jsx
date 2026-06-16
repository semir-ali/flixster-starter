import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Search' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/watched', label: 'Watched' },
];

function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {NAV_ITEMS.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className={`bottom-nav-link ${location.pathname === to ? 'active' : ''}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export default BottomNav;
