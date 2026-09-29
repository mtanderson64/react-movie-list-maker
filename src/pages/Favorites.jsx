import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "../css/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

// Individual Card Component with Sortable Hooks
function SortableMovieCard({ movie }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: movie.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // Dim the original spot while dragging
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="draggable-card-wrapper"
    >
      <MovieCard movie={movie} />
    </div>
  );
}

function Favorites() {
  const { favorites, reorderFavorites } = useMovieContext();
  const [activeId, setActiveId] = useState(null);

  // Configure Sensors for 500ms delay on both Mouse and Touch
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 500,
      tolerance: 5,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 500,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = favorites.findIndex(
        (m) => m.id.toString() === active.id
      );
      const newIndex = favorites.findIndex(
        (m) => m.id.toString() === over.id
      );

      const items = Array.from(favorites);
      const [reorderedItem] = items.splice(oldIndex, 1);
      items.splice(newIndex, 0, reorderedItem);

      reorderFavorites(items);
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeMovie = activeId
    ? favorites.find((m) => m.id.toString() === activeId)
    : null;

  if (favorites && favorites.length > 0) {
    return (
      <div className="favorites">
        <h2>Your Favorites</h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={favorites.map((m) => m.id.toString())}
            strategy={rectSortingStrategy}
          >
            <div className="movies-grid">
              {favorites.map((movie) => (
                <SortableMovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </SortableContext>

          {/* DragOverlay renders the floating clone directly under the cursor */}
          <DragOverlay adjustScale={false}>
            {activeMovie ? (
              <div className="draggable-card-wrapper is-dragging">
                <MovieCard movie={activeMovie} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    );
  }

  return (
    <div className="favorites-empty">
      <h2>No Favorites</h2>
      <p>Start adding movies to your favorites and they will appear here.</p>
    </div>
  );
}

export default Favorites;