import { useState, useEffect, useRef } from "react";

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

import MovieCard from "./MovieCard";
import "../css/SortableMovieGrid.css";

// Individual draggable movie card receives currentListId and passes it to MovieCard
function SortableMovieCard({ movie, currentListId }) {
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
      className={`draggable-card-wrapper ${
        isDragging ? "placeholder-slot" : ""
      }`}
    >
      <MovieCard movie={movie} currentListId={currentListId} />
    </div>
  );
}

// Grid receives currentListId as an optional prop
function SortableMovieGrid({ movies, onReorder, currentListId }) {
  const [items, setItems] = useState(movies ?? []);
  const [activeId, setActiveId] = useState(null);
  const isDraggingRef = useRef(false);

  // Keep grid synchronized with props when not dragging
  useEffect(() => {
    if (!isDraggingRef.current) {
      setItems(movies ?? []);
    }
  }, [movies]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 200,
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

    const activeIndex = items.findIndex(
      (movie) => movie.id.toString() === active.id
    );

    const overIndex = items.findIndex(
      (movie) => movie.id.toString() === over.id
    );

    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      setItems((previousItems) =>
        arrayMove(previousItems, activeIndex, overIndex)
      );
    }
  };

  const handleDragEnd = () => {
    setActiveId(null);
    isDraggingRef.current = false;
    if (onReorder) {
      onReorder(items);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    isDraggingRef.current = false;
    setItems(movies ?? []);
  };

  const activeMovie = activeId
    ? items.find((movie) => movie.id.toString() === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={items.map((movie) => movie.id.toString())}
        strategy={rectSortingStrategy}
      >
        <div className="movies-grid">
          {items.map((movie) => (
            <SortableMovieCard
              key={movie.id}
              movie={movie}
              currentListId={currentListId}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay adjustScale={false}>
        {activeMovie ? (
          <div className="draggable-card-wrapper is-dragging">
            <MovieCard movie={activeMovie} currentListId={currentListId} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default SortableMovieGrid;