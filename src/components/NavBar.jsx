import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/NavBar.css";
import AuthDropdown from "./AuthDropdown";

function NavBar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={closeMenu}>
          <div className="navbar-logo">
            <img
              src="/src/assets/logo.svg"
              alt="Movie Mem"
              className="nav-logo-img"
            />
            <p>
              Movie
              <br />
              Mem
            </p>
          </div>
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/favorites" className="nav-link">
          Favorites
        </Link>
        <Link to="/lists" className="nav-link">
          Lists
        </Link>
        <AuthDropdown user={user} />
      </div>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      <div
        id="mobile-navigation"
        className={`mobile-links ${menuOpen ? "mobile-links-active" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <Link to="/" className="mobile-link" onClick={closeMenu}>
          Home
        </Link>
        <Link
          to="/favorites"
          className="mobile-link"
          onClick={closeMenu}
        >
          Favorites
        </Link>
        <Link to="/lists" className="mobile-link" onClick={closeMenu}>
          Lists
        </Link>
        <AuthDropdown user={user} className="mobile-link" />
      </div>
    </nav>
  );
}

export default NavBar;