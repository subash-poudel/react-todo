import ValidationError from "../errors/ValidationError";

export function reorder(list, startIndex, endIndex) {
  if (!Array.isArray(list) || list.length === 0) {
    return list;
  }
  // validate input parameters
  if (
    startIndex >= list.length ||
    endIndex >= list.length ||
    startIndex < 0 ||
    endIndex < 0
  ) {
    throw new ValidationError(
      `Please check your parameters: array length=${list.length} startIndex=${startIndex} endIndex=${endIndex}`
    );
  }
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

// used to fix the order integer in frontend
export function fixTodoOrders(todos) {
  // fix todo's order in frontend
  const ordersArray = todos.map((todo) => todo.order);
  let maxCurrentOrder = Math.max(...ordersArray);
  const newTodos = [...todos];
  for (let i = 0; i < newTodos.length; i++) {
    newTodos[i].order = maxCurrentOrder;
    maxCurrentOrder = maxCurrentOrder - 1;
  }
  return newTodos;
}

// used to send a bulk update query for backend
export function getTodosOrderUpdateArray(todos) {
  return todos.map(({ id, order }) => {
    return { id, order };
  });
}
