import { useTodos } from "../customHooks/useTodos";
import { renderHook, act } from "@testing-library/react-hooks";

test("should filter and return correct data when called initially", () => {
  const todos = [
    { date: "a", text: "a" },
    { date: "b", text: "b" },
    { date: "a", text: "c" },
    { date: "b", text: "d" },
    { date: "a", text: "e" },
  ];
  const { result } = renderHook(() =>
    useTodos(todos, "a", (todo) => {
      return todo.date === "a";
    })
  );

  const expectedFilteredTodos = [
    { date: "a", text: "a" },
    { date: "a", text: "c" },
    { date: "a", text: "e" },
  ];

  expect(result.current.todos).toEqual(expectedFilteredTodos);
  expect(result.current.mainTodos).toEqual(todos);
  expect(result.current.numOfLoadedTodos).toEqual(todos.length);
});

test("should update filters when new data is added", () => {
  const initialTodos = [
    { date: "a", text: "a" },
    { date: "b", text: "b" },
    { date: "a", text: "c" },
    { date: "b", text: "d" },
    { date: "a", text: "e" },
  ];
  const { result } = renderHook(() =>
    useTodos(initialTodos, "b", (todo) => {
      return todo.date === "b";
    })
  );

  const newAddedTodos = [
    { date: "b", text: "added new" },
    { date: "a", text: "b" },
    { date: "b", text: "another one added" },
    { date: "a", text: "d" },
    { date: "a", text: "e" },
  ];
  const combinedTodos = [...newAddedTodos, ...initialTodos];
  act(() => {
    result.current.setTodos(combinedTodos);
  });

  const expectedFilteredTodos = [
    { date: "b", text: "added new" },
    { date: "b", text: "another one added" },
    { date: "b", text: "b" },
    { date: "b", text: "d" },
  ];

  expect(result.current.todos).toEqual(expectedFilteredTodos);
  expect(result.current.mainTodos).toEqual(combinedTodos);
  expect(result.current.numOfLoadedTodos).toEqual(combinedTodos.length);
});
