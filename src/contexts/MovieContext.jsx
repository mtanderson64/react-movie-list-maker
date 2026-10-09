import { createContext, useState, useContext, useEffect, useRef } from "react";
import { db, auth } from "../services/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customLists, setCustomLists] = useState([]);

  // Ref to prevent snapshot listener from overwriting local state during drag/drop ops
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setFavorites([]); // Clear favorites if user logs out
      }
      setLoading(false);
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

  const createList = async (title) => {
    if (!user) {
      alert("Please sign in to create a list!");
      return;
    }

    try {
      const customListsRef = collection(db, "users", user.uid, "customLists");
      await addDoc(customListsRef, {
        title: title,
        createdAt: serverTimestamp(),
        movies: [] // Starts as an empty array of movies
      });
    } catch (error) {
      console.error("Error creating custom list:", error);
    }
  };

  const addMovieToList = async (listId, movie) => {
    if (!user) {
      alert("Please sign in to add movies to a list!");
      return;
    }

    try {
      const listRef = doc(
        db,
        "users",
        user.uid,
        "customLists",
        listId
      );

      await updateDoc(listRef, {
        movies: arrayUnion(movie)
      });
    } catch (error) {
      console.error("Error adding movie to list:", error);
    }
  };

  // Reorder movies inside a specific Custom List
  const reorderCustomList = async (listId, updatedMovies) => {
    if (!user) return;

    // Immediately update local customLists state for responsive drag & drop UI
    setCustomLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId ? { ...list, movies: updatedMovies } : list
      )
    );

    try {
      const listRef = doc(db, "users", user.uid, "customLists", listId);
      await updateDoc(listRef, {
        movies: updatedMovies,
      });
    } catch (error) {
      console.error("Error updating custom list order in Firebase:", error);
    }
  };

  const removeMovieFromList = async (listId, movieId) => {
    if (!user) return;

    // Optimistic UI update
    setCustomLists((prevLists) =>
      prevLists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            movies: list.movies.filter((m) => m.id !== movieId),
          };
        }
        return list;
      })
    );

    try {
      const listRef = doc(db, "users", user.uid, "customLists", listId);
      const targetList = customLists.find((l) => l.id === listId);
      if (!targetList) return;

      const updatedMovies = targetList.movies.filter((m) => m.id !== movieId);
      await updateDoc(listRef, {
        movies: updatedMovies,
      });
    } catch (error) {
      console.error("Error removing movie from custom list:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      setCustomLists([]);
      return;
    }

    const customListsRef = collection(db, "users", user.uid, "customLists");
    const q = query(customListsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCustomLists(listsData);
    });

    return () => unsubscribe();
  }, [user]);

  const value = {
    user,
    loading,
    favorites,
    addToFavorites,
    removeFromFavorites,
    reorderFavorites,
    isFavorite,
    createList,
    addMovieToList,
    reorderCustomList,
    customLists,
    removeMovieFromList,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};