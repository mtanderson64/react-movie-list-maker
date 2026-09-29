import { createContext, useState, useContext, useEffect } from "react";
import { db, auth } from "../services/firebase";
import { doc, setDoc, deleteDoc, collection, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({children}) => {
  const [favorites, setFavorites] = useState([]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setFavorites([]); // Clear favorites if user logs out
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Reference to: users/{userId}/favorites
    const favoritesRef = collection(db, "users", user.uid, "favorites");

    // Automatically update `favorites` state whenever Firestore changes
    const unsubscribe = onSnapshot(favoritesRef, (snapshot) => {
      const favList = snapshot.docs.map((doc) => doc.data());
      setFavorites(favList);
    });
    return () => unsubscribe();
  }, [user]);

  // Add movie to Firestore
  const addToFavorites = async (movie) => {
    if (!user) {
      alert("Please sign in to save favorites!");
      return;
    }

    try {
      // Points to: users/{userId}/favorites/{movieId}
      const movieRef = doc(db, "users", user.uid, "favorites", movie.id.toString());
      await setDoc(movieRef, movie);
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const removeFromFavorites = async (movieId) => {
    if (!user) return;

    try {
      // Points to: users/{userId}/favorites/{movieId}
      const movieRef = doc(db, "users", user.uid, "favorites", movieId.toString());
      await deleteDoc(movieRef);
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const reorderFavorites = async (newFavorites) => {
    // 1. Update local React state instantly so the UI responds right away
    setFavorites(newFavorites);

    if (!user) return;

    // 2. Optional: Save order to Firebase if user is logged in
    try {
      // Loop through each movie and save its new position index in Firestore
      const updatePromises = newFavorites.map((movie, index) => {
        const movieRef = doc(db, "users", user.uid, "favorites", movie.id.toString());
        return setDoc(movieRef, { ...movie, order: index }, { merge: true });
      });
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error updating favorite order in Firebase:", error);
    }
  };

  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId)
  }

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    reorderFavorites,
    isFavorite
  }
  
  return <MovieContext.Provider value={value}>
    {children}
  </MovieContext.Provider>
}