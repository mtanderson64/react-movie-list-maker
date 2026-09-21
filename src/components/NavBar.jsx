import { Link } from "react-router-dom";
import '../css/NavBar.css'
import AuthDropdown from "./AuthDropdown";

function NavBar({ user }) {
  return <nav className="navbar">
    <div className="navbar-brand">
      <Link to="/">Movie Mem</Link>
    </div>
    <div className="navbar-links">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/favorites" className="nav-link">Favorites</Link>
      <AuthDropdown user={user}/>
    </div>
  </nav>
}

export default NavBar