import express from "express";
import fs from "fs";
import cors from "cors";

const todo = express();

todo.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000", // 허용할 출처
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // 허용할 HTTP 메서드
  credentials: true, // 자격 증명(쿠키 등)을 허용할지 여부
};
todo.use(cors(corsOptions));

const DATA_FILE = "./todoData.json";

// 파일에서 데이터를 읽는 함수
const readtodos = () => {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
};

// 파일에 데이터를 저장하는 함수
const savetodos = (todos) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
};

// todos 가져오기 /
// res {[todo, todo ...];} 200
todo.get("/", (req, res) => {
  const todos = readtodos();
  res.status(200).json(todos);
});

// 새로운 todo 생성 /
// req {text}
// res {todo} 201
todo.post("/", (req, res) => {
  const todos = readtodos();
  const { text } = req.body;
  //   const randomNumber = Math.random();
  const newtodo = {
    id: Date.now(),
    status: "active",
    text,
    createdAt: new Date().toISOString(),
  };
  todos.push(newtodo);
  savetodos(todos);
  res.status(201).json(newtodo);
});

// 이미 작성한 todo (active completed) 변환 /:id
// req
// res {todo} 200
todo.put("/:id", (req, res) => {
  const todos = readtodos();
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).send("Todo not found");
  }

  // 상태 반전 함수
  const toggleStatus = (status) => {
    return status === "active" ? "completed" : "active";
  };

  // 현재 할 일의 상태를 반전시킴
  todos[todoIndex].status = toggleStatus(todos[todoIndex].status);

  savetodos(todos);
  res.status(200).json(todos[todoIndex]);
});

// 작성된 todo 삭제 /:id
// res 204
todo.delete("/:id", (req, res) => {
  let todos = readtodos();
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex((todo) => todo.id === id);
  if (todoIndex !== -1) {
    todos = todos.filter((todo) => todo.id !== id);
    savetodos(todos);
    res.status(204).send();
  } else {
    res.status(404).send("todo not found");
  }
});

const PORT = process.env.PORT || 8080;

todo.listen(PORT, () => {
  console.log("Server is running on port 8080");
});
