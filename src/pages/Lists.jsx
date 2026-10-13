import { Link } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/Lists.css";
import { useState } from "react";

function Lists() {
  const { customLists, deleteList, createList } = useMovieContext();

  const [listTitle, setListTitle] = useState("");

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!listTitle.trim()) return;
    await createList(listTitle.trim());
    setListTitle("");
  };

  return (
    <div className="lists-page">
      <div className="lists-page-header">
        <h2>My Lists</h2>
        <form onSubmit={handleCreateList} className="create-list-form">
          <input 
            type="text" 
            placeholder="Enter list title..."
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
          />
        </form>
      </div>
      <div className="lists-grid">
        {customLists.map((list) => {
          const previewMovies = list.movies?.slice(0, 3) || [];

          return (
            <Link key={list.id} to={`/lists/${list.id}`} className="list-card">
              <div className="list-card-header">
                <div className="list-card-top">
                  <h3>{list.title}</h3>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteList(list.id);
                    }}
                  >
                  Delete
                  </button>
                </div> 
                <p className="list-card-count">
                  {list.movies?.length ?? 0}{" "}
                  {list.movies?.length === 1 ? "movie" : "movies"}
                </p>
              </div>

              <div className="list-card-posters">
                {previewMovies.length > 0 ? (
                  previewMovies.map((movie) => (
                    <img
                      key={movie.id}
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      className="list-card-poster-thumb"
                    />
                  ))
                ) : (
                  <div className="list-card-empty-preview">
                    <span>Empty List</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Lists;