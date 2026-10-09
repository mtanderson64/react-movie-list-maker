import React from "react";
import { useMovieContext } from "../contexts/MovieContext";
import SortableMovieGrid from "../components/SortableMovieGrid";
import "../css/Favorites.css";

function Favorites() {
  const { favorites, reorderFavorites } = useMovieContext();

  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>No Favorites</h2>
        <p>Start adding movies to your favorites and they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h2>Your Favorites</h2>
      <SortableMovieGrid
        movies={favorites}
        onReorder={(newOrder) => reorderFavorites(newOrder)}
      />
    </div>
  );
}

export default Favorites;