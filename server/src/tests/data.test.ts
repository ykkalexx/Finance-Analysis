import request from "supertest";
import express, { Request, Response } from "express";
import {
  monthlySumController,
  commonTransactionController,
  analyzeDataController,
} from "../controllers/DataControllers";

jest.mock("../aws/aws", () => ({
  Lambda: jest.fn().mockImplementation(() => ({
    invoke: jest.fn().mockImplementation(() => ({
      promise: jest.fn(),
    })),
  })),
}));

jest.mock("../database/db", () => ({
  query: jest.fn(),
}));

const app = express();
app.use(express.json());

app.post("/monthly-sum", monthlySumController);
app.post("/common-transaction", commonTransactionController);
app.post("/analyze-data", analyzeDataController);

describe("Controllers", () => {
  it("should handle monthlySumController", async () => {
    const res = await request(app)
      .post("/monthly-sum")
      .send({ customerNumber: "12345" });

    expect(res.statusCode).toEqual(200);
  });

  it("should handle commonTransactionController", async () => {
    const res = await request(app)
      .post("/common-transaction")
      .send({ customerNumber: "12345" });

    expect(res.statusCode).toEqual(200);
  });

  it("should handle analyzeDataController", async () => {
    const res = await request(app)
      .post("/analyze-data")
      .send({ customerNumber: "12345" });

    expect(res.statusCode).toEqual(200);
  });
});
