import { useState, useEffect } from "react";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Paper, Box } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { useTodos } from "../customHooks/useTodos";
import { format, YYYY_MM_DD } from "../utils/dateUtil";

import Header from "./widgets/Header";
import EmptyTodos from "./widgets/EmptyTodos";
import TodoInputField from "./widgets/TodoInputField";
import DragDropContainer from "./widgets/DragDropContainer";
import { fixTodoOrders, getTodosOrderUpdateArray } from "../utils/appUtil";

const useStyles = makeStyles({
  todosContainer: { marginTop: 10, padding: 10 },
});

export const PAGINATION_LIMIT = 2;

function App() {
  const classes = useStyles();
  const [newTodoText, setNewTodoText] = useState("");
  const [allTodosLoaded, setAllTodosLoaded] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [filterTodosForToday, setFilterForToday] = useState(false);
  const today = format(new Date(), YYYY_MM_DD);
  const { todos, setTodos, numOfLoadedTodos, mainTodos } = useTodos(
    [],
    filterTodosForToday,
    (todo) => {
      return todo.date === today;
    }
  );

  function fetchTodos() {
    if (allTodosLoaded || loadingTodos) {
      return;
    }
    const url = `http://localhost:3001/?startIndex=${numOfLoadedTodos}&limit=${PAGINATION_LIMIT}`;
    setLoadingTodos(true);
    fetch(url)
      .then((response) => response.json())
      .then((todos) => {
        if (Array.isArray(todos) && todos.length === 0) {
          setAllTodosLoaded(true);
        }
        // todo use mainTodos as an accumulator
        setTodos([...mainTodos, ...todos]);
        setLoadingTodos(false);
      });
  }

  // loads todos initially
  // FixMe handle via custom hook
  useEffect(() => {
    fetchTodos();
  }, []);

  function addTodo(todo) {
    fetch("http://localhost:3001/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(todo),
    })
      .then((response) => response.json())
      // add new todos to the front as returned by the api
      .then((newTodo) => setTodos([newTodo, ...todos]));
    setNewTodoText("");
  }

  function toggleTodoCompleted(id) {
    fetch(`http://localhost:3001/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        completed: !todos.find((todo) => todo.id === id).completed,
      }),
    }).then(() => {
      const newTodos = [...todos];
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        completed: !newTodos[modifiedTodoIndex].completed,
      };
      setTodos(newTodos);
    });
  }

  function deleteTodo(id) {
    fetch(`http://localhost:3001/${id}`, {
      method: "DELETE",
    }).then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  }

  function onSwitchToggle(e) {
    setFilterForToday(e.target.checked);
  }

  function reorderTodo(newTodos) {
    const todos = fixTodoOrders(newTodos);
    setTodos(todos);
    // prepare for api call
    const updateRequestParams = getTodosOrderUpdateArray(todos);
    fetch("http://localhost:3001/bulkUpdate", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(updateRequestParams),
    }).then((response) => response.json());
  }

  return (
    <Container maxWidth="md">
      <Header title="Todos" />
      <TodoInputField
        addTodo={addTodo}
        newTodoText={newTodoText}
        setNewTodoText={setNewTodoText}
      />
      <FormControlLabel
        control={
          <Switch onChange={onSwitchToggle} checked={filterTodosForToday} />
        }
        label="Show tasks due today"
      />
      {todos.length > 0 && (
        <Paper className={classes.todosContainer}>
          <Box display="flex" flexDirection="column" alignItems="stretch">
            <DragDropContainer
              todos={todos}
              allTodosLoaded={allTodosLoaded}
              loadingTodos={loadingTodos}
              loadMoreTodos={fetchTodos}
              toggleTodoCompleted={toggleTodoCompleted}
              deleteTodo={deleteTodo}
              reorderTodo={reorderTodo}
            />
          </Box>
        </Paper>
      )}
      {todos.length === 0 && <EmptyTodos />}
    </Container>
  );
}

export default App;
