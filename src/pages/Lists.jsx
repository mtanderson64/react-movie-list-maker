import { Link } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/Lists.css";

function Lists() {
  const { customLists } = useMovieContext();

  return (
    <div className="lists-page">
      <h2>My Lists</h2>

      <div className="lists-grid">
        {customLists.map((list) => {
          const previewMovies = list.movies?.slice(0, 2) || [];

          return (
            <Link key={list.id} to={`/lists/${list.id}`} className="list-card">
              <div className="list-card-header">
                <h3>{list.title}</h3>
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