import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000", // 허용할 출처
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // 허용할 HTTP 메서드
  credentials: true, // 자격 증명(쿠키 등)을 허용할지 여부
};
app.use(cors(corsOptions));

app.use("/", todoRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
