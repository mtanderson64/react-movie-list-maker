import { Link } from "react-router-dom";
import '../css/NavBar.css'
import GoogleAuthButton from "./GoogleAuthButton";

function NavBar() {
  return <nav className="navbar">
    <div className="navbar-brand">
      <Link to="/">Movie Mem</Link>
    </div>
    <div className="navbar-links">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/favorites" className="nav-link">Favorites</Link>
      <GoogleAuthButton user={user}/>
    </div>
  </nav>
}

export default NavBar