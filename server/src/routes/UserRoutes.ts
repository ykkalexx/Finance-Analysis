import {
  createNewUser,
  fetchAllUserDataByCustomerNo,
} from "../controllers/UserControllers";
import express from "express";

const userRouter = express.Router();

userRouter.post("/create-user", createNewUser);

userRouter.get("/user/:customer_number", fetchAllUserDataByCustomerNo);

export default userRouter;
