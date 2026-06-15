import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-copyright">
          © {currentYear} Flixster. All rights reserved.
        </p>
        <p className="footer-attribution">
          Movie data provided by{' '}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            The Movie Database (TMDb)
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
