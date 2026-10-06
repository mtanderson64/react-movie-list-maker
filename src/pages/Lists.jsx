import React, { useState } from "react";
import { useMovieContext } from "../contexts/MovieContext";

function Lists() {
  const { user, loading, createList, customLists } = useMovieContext();
  const [listTitle, setListTitle] = useState("");

  

  if (loading) {
    return <div className="lists-container"><p>Loading...</p></div>;
  }

  if (!user) {
    return (
      <div className="lists-container">
        <h2>Custom Lists</h2>
        <p>Please sign in to create and manage custom lists.</p>
      </div>
    );
  }

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!listTitle.trim()) return;

    await createList(listTitle.trim());
    setListTitle(""); // Clear input after submission
  };

  return (
    <div className="lists-container">
      <h2>Your Lists</h2>

      <form onSubmit={handleCreateList} className="create-list-form">
        <input
          type="text"
          placeholder="Enter list title (e.g., Sci-Fi Favorites)..."
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
        />
        <button type="submit">Create List</button>
      </form>

      <div className="custom-lists-grid">
        {customLists.length === 0 ? (
          <p>No custom lists yet. Create one above!</p>
        ) : (
          customLists.map((list) => (
            <div key={list.id} className="list-card">
              <h3>{list.title}</h3>
              <p>{list.movies ? list.movies.length : 0} movies</p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Lists;