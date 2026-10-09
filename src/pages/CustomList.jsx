import { useParams, Link } from "react-router-dom";
import { useMovieContext } from "../contexts/MovieContext";
import SortableMovieGrid from "../components/SortableMovieGrid";
import "../css/CustomList.css";

function CustomList() {
  const { listId } = useParams();
  const { user, loading, customLists, reorderCustomList } = useMovieContext();

  if (loading) {
    return <div className="custom-list-page">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="custom-list-page">
        <p>Please sign in to view your lists.</p>
      </div>
    );
  }

  const list = customLists.find((item) => item.id === listId);

  if (!list) {
    return (
      <div className="custom-list-page">
        <h2>List not found</h2>
        <Link to="/lists">Back to My Lists</Link>
      </div>
    );
  }

  return (
    <div className="custom-list-page">
      <Link to="/lists" className="back-to-lists">
        ← Back to My Lists
      </Link>

      <h2>{list.title}</h2>
      <p className="custom-list-count">
        {list.movies?.length ?? 0} movies
      </p>

      {list.movies?.length > 0 ? (
        <SortableMovieGrid
          movies={list.movies}
          currentListId={list.id}
          onReorder={(newMoviesOrder) =>
            reorderCustomList(list.id, newMoviesOrder)
          }
        />
      ) : (
        <p className="empty-custom-list">
          This list is empty. Add movies from the Home page using the + button.
        </p>
      )}
    </div>
  );
}

export default CustomList;