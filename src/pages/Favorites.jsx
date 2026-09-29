import React, { useState, useEffect, useRef } from "react";
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
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "../css/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

// Individual Draggable Card Component
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
    opacity: isDragging ? 0 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`draggable-card-wrapper ${isDragging ? "placeholder-slot" : ""}`}
    >
      <MovieCard movie={movie} />
    </div>
  );
}

function Favorites() {
  const { favorites, reorderFavorites } = useMovieContext();
  
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const isDraggingRef = useRef(false);

  // Sync with favorites context ONLY when not dragging
  useEffect(() => {
    if (favorites && !isDraggingRef.current) {
      setItems(favorites);
    }
  }, [favorites]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 200, // Reduced from 500ms for more responsive hold-to-drag
      tolerance: 5,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event) => {
    isDraggingRef.current = true;
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeIndex = items.findIndex((m) => m.id.toString() === active.id);
    const overIndex = items.findIndex((m) => m.id.toString() === over.id);

    if (activeIndex !== overIndex) {
      setItems((prevItems) => arrayMove(prevItems, activeIndex, overIndex));
    }
  };

  const handleDragEnd = () => {
    setActiveId(null);
    isDraggingRef.current = false;
    // Persist final local state to Context & Firebase
    reorderFavorites(items);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    isDraggingRef.current = false;
    setItems(favorites);
  };

  const activeMovie = activeId
    ? items.find((m) => m.id.toString() === activeId)
    : null;

  if (items && items.length > 0) {
    return (
      <div className="favorites">
        <h2>Your Favorites</h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={items.map((m) => m.id.toString())}
            strategy={rectSortingStrategy}
          >
            <div className="movies-grid">
              {items.map((movie) => (
                <SortableMovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </SortableContext>

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