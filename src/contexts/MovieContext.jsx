import { createContext, useState, useContext, useEffect, useRef } from "react";
import { db, auth } from "../services/firebase";
import { doc, setDoc, deleteDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  // Ref to prevent snapshot listener from overwriting local state during drag/drop ops
  const isUpdatingRef = useRef(false);

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

    // Reference with sorting by order field
    const favoritesRef = collection(db, "users", user.uid, "favorites");
    const q = query(favoritesRef, orderBy("order", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Don't overwrite state if we are currently performing a reorder update
      if (isUpdatingRef.current) return;

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
      const movieRef = doc(db, "users", user.uid, "favorites", movie.id.toString());
      // Assign default order index to the end of the array
      const newOrder = favorites.length;
      await setDoc(movieRef, { ...movie, order: newOrder }, { merge: true });
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const removeFromFavorites = async (movieId) => {
    if (!user) return;

    try {
      const movieRef = doc(db, "users", user.uid, "favorites", movieId.toString());
      await deleteDoc(movieRef);
    } catch (error) {
      console.error("Error removing from favorites:", error);
    }
  };

  const reorderFavorites = async (newFavorites) => {
    // Lock snapshot updates so Firebase doesn't trigger a race condition
    isUpdatingRef.current = true;

    // Update local state immediately
    setFavorites(newFavorites);

    if (user) {
      try {
        const updatePromises = newFavorites.map((movie, index) => {
          const movieRef = doc(db, "users", user.uid, "favorites", movie.id.toString());
          return setDoc(movieRef, { ...movie, order: index }, { merge: true });
        });
        await Promise.all(updatePromises);
      } catch (error) {
        console.error("Error updating favorite order in Firebase:", error);
      }
    }

    // Unlock snapshot updates after write finishes
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 500);
  };

  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    reorderFavorites,
    isFavorite,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};