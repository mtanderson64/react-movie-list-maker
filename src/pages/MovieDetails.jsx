
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../services/api";
import "../css/MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        setError(null);

        const movieData = await getMovieDetails(id);
        setMovie(movieData);
      } catch (err) {
        console.error(err);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  
  return (
  <div className="movie-details-page">
    {loading ? (
      <p>Loading movie...</p>
    ) : error ? (
      <p>{error}</p>
    ) : !movie ? (
      <p>Movie not found.</p>
    ) : (
      
      <div className="page-content">
        <button
          className="movie-details-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <div className="movie-details-container">

          <div className="movie-details-poster">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Poster"
              }
              alt={movie.title}
            />
          </div>

          <div className="movie-details-info">
            <h2>{movie.title}</h2>

            <div className="movie-meta">
              <p><span>Release Date:</span> {movie.release_date}</p>
              <p><span>Runtime:</span> {movie.runtime} minutes</p>
              <p><span>Rating:</span> {movie.vote_average.toFixed(1)} / 10</p>
              <p>
                <span>Genres:</span>{" "}
                {movie.genres.map((genre) => genre.name).join(", ")}
              </p>
            </div>

            

            <p className="movie-overview">{movie.overview}</p>
          </div>
        </div>
      </div>
    )}
  </div>
  );

}

export default MovieDetails;
