import { Request, Response } from "express";
import AWS from "../aws/aws";
import db from "../database/db";

const lambda = new AWS.Lambda();

export const createNewUser = async (req: Request, res: Response) => {
  try {
    const customer_number = Math.floor(100000 + Math.random() * 900000);

    const { email } = req.body;

    db.query(
      "INSERT INTO users (customer_number, email) VALUES (? , ?)",
      [customer_number, email],
      (err, results) => {
        if (err) {
          console.error("Failed to insert data into the database:", err);
          res
            .status(500)
            .json({ error: "Failed to insert data into the database" });
          return;
        }

        console.log("Data inserted into the database:", results);

        // Invoke the Lambda function
        const params = {
          FunctionName: "your_lambda_function_name",
          InvocationType: "RequestResponse",
          Payload: JSON.stringify({ customer_number }),
        };

        lambda.invoke(params, function (err, data) {
          if (err) {
            console.error(err, err.stack);
          } else {
            console.log(data);
          }
        });

        res.status(200).json({ message: "Success" });
      }
    );
  } catch (error) {
    console.log(error);
    const errorMessage = { message: error.message, stack: error.stack };
    res.status(500).json({ error: errorMessage });
  }
};

export const fetchAllUserData = async (req: Request, res: Response) => {};
