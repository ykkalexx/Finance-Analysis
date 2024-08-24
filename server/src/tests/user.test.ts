import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import {
  createNewUser,
  fetchAllUserDataByCustomerNo,
} from "../controllers/UserControllers";
import AWS from "../aws/aws";
import db from "../database/db";

jest.mock("../aws/aws", () => ({
  Lambda: jest.fn().mockImplementation(() => ({
    invoke: jest.fn().mockImplementation((params, callback) => {
      callback(null, { Payload: JSON.stringify({ message: "Success" }) });
    }),
  })),
}));

jest.mock("../database/db", () => ({
  query: jest.fn().mockImplementation((query, params, callback) => {
    callback(null, [{ customer_number: "12345", email: "test@test.com" }]);
  }),
}));

const app = express();
app.use(express.json());
app.post("/createNewUser", createNewUser);
app.get(
  "/fetchAllUserDataByCustomerNo/:customer_number",
  fetchAllUserDataByCustomerNo
);

describe("User Controller", () => {
  it("should create a new user", async () => {
    const res = await request(app)
      .post("/createNewUser")
      .send({ email: "test@test.com" });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Success");
  });

  it("should fetch all user data by customer number", async () => {
    const res = await request(app).get("/fetchAllUserDataByCustomerNo/12345");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Success");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data[0]).toHaveProperty("customer_number", "12345");
    expect(res.body.data[0]).toHaveProperty("email", "test@test.com");
  });
});
