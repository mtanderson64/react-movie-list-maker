import { useState } from "react";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/MovieCard.css";

function MovieCard({ movie, currentListId }) {
  const {
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    customLists,
    addMovieToList,
    removeMovieFromList,
  } = useMovieContext();

  const [showMenu, setShowMenu] = useState(false);
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const handleAddToListClick = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const handleSelectCustomList = (e, listId) => {
    e.stopPropagation();
    addMovieToList(listId, movie);
    setShowMenu(false);
  };

  const handleRemoveFromList = (e) => {
    e.stopPropagation();
    if (currentListId) {
      removeMovieFromList(currentListId, movie.id);
    }
  };

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Poster"
          }
          alt={movie.title}
        />
        <div className="movie-overlay" />

        <div className="movie-card-actions">
          {/* Heart Button */}
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={handleFavoriteClick}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            ♥
          </button>

          {/* Plus / Add-to-List Button */}
          <div className="list-menu-container">
            <button
              className="add-to-list-btn"
              onClick={handleAddToListClick}
              title="Add to custom list"
            >
              <span>+</span>
            </button>

            {showMenu && (
              <div className="add-to-list-menu">
                {customLists && customLists.length > 0 ? (
                  customLists.map((list) => (
                    <button
                      key={list.id}
                      onClick={(e) => handleSelectCustomList(e, list.id)}
                    >
                      {list.title}
                    </button>
                  ))
                ) : (
                  <p>No lists created yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Trash Can Remove Button (Rendered ONLY on custom list pages) */}
          {currentListId && (
            <button
              className="remove-from-list-btn"
              onClick={handleRemoveFromList}
              title="Remove from this list"
            >
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 3.5H13M2.5 3.5V13.25C2.5 13.9404 3.05964 14.5 3.75 14.5H10.25C10.9404 14.5 11.5 13.9404 11.5 13.25V3.5M4.75 3.5V2C4.75 1.44772 5.19772 1 5.75 1H8.25C8.80228 1 9.25 1.44772 9.25 2V3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.split("-")[0]}</p>
      </div>
    </div>
  );
}

export default MovieCard;