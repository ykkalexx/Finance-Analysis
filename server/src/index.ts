import express from "express";
import http from "http";
import cors from "cors";
import router from "../src/routes/DataRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

const server = http.createServer(app);
server.listen(8000, () => {
  console.log("Server is running on port 8000");
});
