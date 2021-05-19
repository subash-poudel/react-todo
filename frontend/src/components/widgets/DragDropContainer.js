import React from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import Todo from "../widgets/Todo";
import { reorder } from "../../utils/appUtil";

const grid = 3;
const itemSize = 70;

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "white",
  padding: grid,
  width: "100%",
});

// inline styles from both react-beautiful-dnd and react-window should be present
const getItemStyle = (isDragging, draggableStyle, virtualListStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "white",
  height: `${itemSize} px`,
  ...draggableStyle,
  ...virtualListStyle,
});

const Row = (props) => {
  const { data, index, style: virtualListStyle } = props;
  const { todos, toggleTodoCompleted, deleteTodo } = data;
  const todo = todos[index];
  // As one placeholder item is added for drag and drop, it won't have todo information
  if (!todo) {
    return null;
  }
  return (
    <Draggable key={todo.id} draggableId={todo.id} index={index}>
      {(provided, snapshot) => {
        const style = getItemStyle(
          snapshot.isDragging,
          provided.draggableProps.style,
          virtualListStyle
        );
        return (
          <Todo
            todoItem={todo}
            toggleTodoCompleted={toggleTodoCompleted}
            key={todo.id}
            deleteTodo={deleteTodo}
            style={style}
            provided={provided}
          />
        );
      }}
    </Draggable>
  );
};
function DragDropContainer(props) {
  const { todos, reorderTodo, allTodosLoaded, loadMoreTodos } = props;

  function onDragEnd(result) {
    // handles case when the drop occurs outside of droppable component
    if (!result.destination) {
      return;
    }

    const newTodosOrder = reorder(
      todos,
      result.source.index,
      result.destination.index
    );

    reorderTodo(newTodosOrder);
  }

  return (
    <>
      <InfiniteLoader
        isItemLoaded={() => allTodosLoaded}
        itemCount={todos.length}
        loadMoreItems={loadMoreTodos}
      >
        {({ onItemsRendered, ref }) => (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId={"column-droppable"}
              mode="virtual"
              type="TASK"
              renderClone={(provided, snapshot, rubric) => {
                const item = todos[rubric.source.index];
                return (
                  <Todo
                    todoItem={item}
                    toggleTodoCompleted={() => {}}
                    key={item.id}
                    deleteTodo={() => {}}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                    provided={provided}
                  />
                );
              }}
            >
              {(droppableProvided, snapshot) => {
                const itemCount = snapshot.isUsingPlaceholder
                  ? todos.length + 1
                  : todos.length;

                return (
                  <List
                    className="custom-scrollbar"
                    style={getListStyle(snapshot.isDraggingOver)}
                    height={600}
                    itemCount={itemCount}
                    itemSize={itemSize}
                    width="100%"
                    outerRef={droppableProvided.innerRef}
                    itemData={props}
                    onItemsRendered={onItemsRendered}
                    ref={ref}
                  >
                    {Row}
                  </List>
                );
              }}
            </Droppable>
          </DragDropContext>
        )}
      </InfiniteLoader>
    </>
  );
}

export default DragDropContainer;
