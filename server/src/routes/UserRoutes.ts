import { createNewUser } from "../controllers/UserControllers";
import express from "express";

const userRouter = express.Router();

userRouter.post("/create-user", createNewUser);

export default userRouter;
