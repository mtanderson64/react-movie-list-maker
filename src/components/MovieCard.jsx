import React, { useState } from "react"
import "../css/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext"


function MovieCard({movie}) {
  const {
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    customLists,
    addMovieToList
  } = useMovieContext()
  const favorite = isFavorite(movie.id)
  const [showListMenu, setShowListMenu] = useState(false)

  function onFavoriteClick(e) {
    e.preventDefault()
    if (favorite) removeFromFavorites(movie.id)
    else addToFavorites(movie)
  }

  return <div className="movie-card">
    <div className="movie-poster">
      <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
      <div className="movie-overlay">
        <div className="movie-card-actions">
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={onFavoriteClick}
            aria-label="Add to favorites"
          >
            ♥
          </button>

          <div className="list-menu-container">
            <button
              className="add-to-list-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowListMenu((prev) => !prev);
              }}
              aria-label="Add to list"
            >
              <span>
                +
              </span>
            </button>

            {showListMenu && (
              <div className="add-to-list-menu">
                {customLists.length === 0 ? (
                  <p>No lists created yet.</p>
                ) : (
                  customLists.map((list) => (
                    <button
                      key={list.id}
                      onClick={async (e) => {
                        e.stopPropagation();
                        await addMovieToList(list.id, movie);
                        setShowListMenu(false);
                      }}
                    >
                      {list.title}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <div className="movie-info">
      <h3>{movie.title}</h3>
      <p>{movie.release_date?.split("-")[0]}</p>
    </div>
  </div>
}

export default MovieCard