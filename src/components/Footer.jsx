import { Link } from "react-router-dom";
import "../css/Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <Link to="/" className="footer-brand">
          <span>Movie<br/>Mem</span>
        </Link>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/lists">Lists</Link>
        </nav>

        <p className="footer-copyright">
          © {new Date().getFullYear()} Movie Mem
        </p>
      </div>
    </footer>
  );
}

export default Footer;