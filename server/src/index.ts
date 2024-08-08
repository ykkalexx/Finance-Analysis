import express from "express";
import http from "http";
import cors from "cors";
import router from "../src/routes/DataRoutes";
import userRouter from "../src/routes/UserRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(userRouter);

const server = http.createServer(app);
server.listen(8000, () => {
  console.log("Server is running on port 8000");
});
