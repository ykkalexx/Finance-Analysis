import { Request, Response } from "express";
import AWS from "../aws/aws";
import db from "../database/db";

const lambda = new AWS.Lambda();

export const monthlySumController = async (req: Request, res: Response) => {
  const params = {
    FunctionName: "monthly-sum",
    InvocationType: "RequestResponse",
  };

  try {
    const lambdaResponse = await lambda.invoke(params).promise();

    const data = JSON.parse(lambdaResponse.Payload as string);

    if (!data || data.length === 0) {
      console.error("No data returned from the lambda function");
      res
        .status(500)
        .json({ error: "No data returned from the lambda function" });
      return;
    }

    const { monthly_sum, customer_number } = data[0];

    const monthlySumInt = parseInt(monthly_sum, 10);
    const customerNumberInt = parseInt(customer_number, 10);

    db.query(
      "INSERT INTO monthly_summaries (customer_number, amount_spend) VALUES (?, ?)",
      [customerNumberInt, monthlySumInt],
      (err, results) => {
        if (err) {
          console.error("Failed to insert data into the database:", err);
          res
            .status(500)
            .json({ error: "Failed to insert data into the database" });
          return;
        }

        console.log("Data inserted into the database:", results);
        res.status(200).json({ message: "Success", data: data });
      }
    );
  } catch (error) {
    console.log(error);
    const errorMessage = { message: error.message, stack: error.stack };
    res.status(500).json({ error: errorMessage });
  }
};

export const commonTransactionController = async (
  req: Request,
  res: Response
) => {
  const params = {
    FunctionName: "common_transaction",
    InvocationType: "RequestResponse",
  };

  try {
    const lambdaResponse = await lambda.invoke(params).promise();

    const data = JSON.parse(lambdaResponse.Payload as string);

    const { common_transaction_type, customer_number } = data[0];

    const customerNumberInt = parseInt(customer_number, 10);

    db.query(
      "INSERT INTO monthly_common_transaction (customer_number, transaction_type) VALUES (?, ?)",
      [customerNumberInt, common_transaction_type],
      (err, results) => {
        if (err) {
          console.error("Failed to insert data into the database:", err);
          res
            .status(500)
            .json({ error: "Failed to insert data into the database" });
          return;
        }

        console.log("Data inserted into the database:", results);
        res.status(200).json({ message: "Success", data: data });
      }
    );
  } catch (error) {
    console.log(error);
    const errorMessage = { message: error.message, stack: error.stack };
    res.status(500).json({ error: errorMessage });
  }
};

export const analyzeDataController = async (req: Request, res: Response) => {
  const params = {
    FunctionName: "analyze_data",
    InvocationType: "RequestResponse",
  };

  try {
    const lambdaResponse = await lambda.invoke(params).promise();

    const data = JSON.parse(lambdaResponse.Payload as string);

    const { customer_number, duplicates, missing, unusual } = data;

    const result = {
      customer_number,
      duplicates: { count: duplicates.count, message: duplicates.message },
      missing: { count: missing.count, message: missing.message },
      unusual: { count: unusual.count, message: unusual.message },
    };

    const customerNumberInt = parseInt(customer_number, 10);

    db.query(
      "INSERT INTO analyzed_data (customer_number, duplicates, missing, unusual) VALUES (?, ?, ?, ?)",
      [customerNumberInt, duplicates.count, missing.count, unusual.count],
      (err, results) => {
        if (err) {
          console.error("Failed to insert data into the database:", err);
          res
            .status(500)
            .json({ error: "Failed to insert data into the database" });
          return;
        }

        console.log("Data inserted into the database:", results);
        res.status(200).json({ message: "Success", data: data });
      }
    );

    // todo setup node mailer to send message to customer
  } catch (error) {
    console.log(error);
    const errorMessage = { message: error.message, stack: error.stack };
    res.status(500).json({ error: errorMessage });
  }
};
