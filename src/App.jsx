import { useEffect, useState } from 'react'
import './css/App.css'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import MovieCard from './components/MovieCard'
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import {Routes, Route} from "react-router-dom"
import { MovieProvider } from './contexts/MovieContext'
import NavBar from './components/NavBar'
import Lists from './pages/Lists';



function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <MovieProvider>
      <NavBar user={user} />
      <main className="main-content"> 
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/favorites" element={<Favorites />}/>
          <Route path="/lists" element={<Lists />}/>
        </Routes>
      </main>
    </MovieProvider>
  )
}

export default App
