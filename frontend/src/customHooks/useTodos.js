import { useEffect, useState } from "react";

export function useTodos(initialValue, filter, filterFunc) {
  const [mainTodos, setMainTodos] = useState(initialValue);
  const [appliedTodos, setAppliedTodos] = useState(initialValue);

  useEffect(() => {
    if (filter) {
      const newFilters = mainTodos.filter(filterFunc);
      setAppliedTodos(newFilters);
    } else {
      setAppliedTodos(mainTodos);
    }
  }, [filter, mainTodos]);

  return {
    todos: appliedTodos,
    mainTodos: mainTodos,
    setTodos: setMainTodos,
    numOfLoadedTodos: mainTodos.length,
  };
}
