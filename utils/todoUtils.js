import fs from "fs";

const DATA_FILE = "./todoData.json";

// 파일에서 데이터를 읽는 함수
export const readTodos = () => {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
};

// 파일에 데이터를 저장하는 함수
export const saveTodos = (todos) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
};
