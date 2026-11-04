import MovieCard from "../components/MovieCard";
import "../css/Home.css";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import { useLocation } from "react-router-dom";
import MovieCardSkeleton from "../components/MovieCardSkeleton";


function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [sortOption, setSortOption] = useState("popularity");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const sortedMovies = [...movies].sort((a, b) => {
  switch (sortOption) {
    case "title":
      return a.title.localeCompare(b.title);

    case "newest":
      return new Date(b.release_date) - new Date(a.release_date);

    case "oldest":
      return new Date(a.release_date) - new Date(b.release_date);

    case "rating-high":
      return b.vote_average - a.vote_average;

    case "rating-low":
      return a.vote_average - b.vote_average;

    case "popularity":
    default:
      return b.popularity - a.popularity;
  }
});

  useEffect(() => {
    setSearchQuery("");/* 
    loadPopularMovies(); */ // Reset to default movies
  }, [location.key]);

  // 1. Move loadPopularMovies out into the main component scope
  const loadPopularMovies = async () => {
    try {
      const popularMovies = await getPopularMovies();
      setMovies(popularMovies);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to load movies.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Run on initial mount
  useEffect(() => {
    loadPopularMovies();
  }, []);

  // 3. Run whenever search input is cleared
  useEffect(() => {
    if (!searchQuery.trim()) {
      loadPopularMovies();
    }
  }, [searchQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadPopularMovies();
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const searchResults = await searchMovies(searchQuery);
      setMovies(searchResults);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to search movies...");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for a Movie..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      <div className="sort-container">
        <label htmlFor="sort-movies">Sort by:</label>

        <select
          id="sort-movies"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="popularity">Popularity</option>
          <option value="title">Title (A–Z)</option>
          <option value="newest">Release Date (Newest)</option>
          <option value="oldest">Release Date (Oldest)</option>
          <option value="rating-high">Rating (Highest)</option>
          <option value="rating-low">Rating (Lowest)</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
          <div className="movies-grid">
            {Array.from({ length: 20 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="movies-grid">
            {sortedMovies.map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))}
          </div>
        )}
    </div>
  );
}

export default Home;
