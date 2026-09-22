import { Link } from "react-router-dom";
import '../css/NavBar.css'
import AuthDropdown from "./AuthDropdown";

function NavBar({ user }) {
  return <nav className="navbar">
    <div className="navbar-brand">
      <Link to="/">
        <div className="navbar-logo">
          <img src="src/assets/logo.svg" alt="" className="nav-logo-img"/>
          <p>Movie<br></br>Mem</p>
        </div>
      </Link>
    </div>
    <div className="navbar-links">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/favorites" className="nav-link">Favorites</Link>
      <AuthDropdown user={user}/>
    </div>
  </nav>
}

export default NavBar