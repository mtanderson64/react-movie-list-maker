import "../css/MovieCardSkeleton.css";

function MovieCardSkeleton() {
  return (
    <div className="movie-card-skeleton">
      <div className="skeleton-poster skeleton-pulse" />

      <div className="skeleton-info">
        <div className="skeleton-title skeleton-pulse" />
        <div className="skeleton-year skeleton-pulse" />
      </div>
    </div>
  );
}

export default MovieCardSkeleton;