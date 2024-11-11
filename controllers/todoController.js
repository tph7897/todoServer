import { readTodos, saveTodos } from "../utils/todoUtils.js";

// todos 가져오기 /
// res {[todo, todo ...];} 200
export const getTodos = (req, res) => {
  const todos = readTodos();
  console.log("todos", todos);
  res.status(200).json(todos);
};

// todo 필터링 :id Active , Completed
// res {[todo, todo ...];} 200
export const filterTodos = (req, res) => {
  let todos = readTodos();
  console.log("req", req);
  const findStatus = req.params.id;
  console.log("findStatus", findStatus);
  todos = todos.filter((todo) => todo.status == findStatus);
  console.log("todos", todos);
  res.status(200).json(todos);
};

// 새로운 todo 생성 /
// req {text}
// res {todo} 201
export const createTodo = (req, res) => {
  const todos = readTodos();
  const { text } = req.body;
  const newTodo = {
    id: Date.now(),
    status: "active",
    text,
    createdAt: new Date().toISOString(),
  };
  todos.push(newTodo);
  saveTodos(todos);
  res.status(201).json(newTodo);
};

// 이미 작성한 todo (active completed) 변환 /:id
// req
// res {todo} 200
export const updateTodo = (req, res) => {
  const todos = readTodos();
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).send("Todo not found");
  }

  // 상태 반전 함수
  const toggleStatus = (status) => (status === "Active" ? "Completed" : "Active");

  // 현재 할 일의 상태를 반전시킴
  todos[todoIndex].status = toggleStatus(todos[todoIndex].status);

  saveTodos(todos);
  res.status(200).json(todos[todoIndex]);
};

// 작성된 todo 삭제 /:id
// res 204
export const deleteTodo = (req, res) => {
  let todos = readTodos();
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex !== -1) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos(todos);
    res.status(204).send();
  } else {
    res.status(404).send("Todo not found");
  }
};
