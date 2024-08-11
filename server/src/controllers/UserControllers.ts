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

        const params = {
          FunctionName: "create_customer",
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

export const fetchAllUserDataByCustomerNo = async (
  req: Request,
  res: Response
) => {
  const customerNumber = req.params.customer_number;

  const query = `
    SELECT * 
    FROM analyzed_data 
    JOIN monthly_common_transaction ON analyzed_data.customer_number = monthly_common_transaction.customer_number
    JOIN monthly_summaries ON analyzed_data.customer_number = monthly_summaries.customer_number
    JOIN users ON analyzed_data.customer_number = users.customer_number
    WHERE analyzed_data.customer_number = ?
  `;

  try {
    db.query(query, [customerNumber], (err, results) => {
      if (err) {
        console.error("Failed to fetch data from the database:", err);
        res
          .status(500)
          .json({ error: "Failed to fetch data from the database" });
        return;
      }

      console.log("Data fetched from the database:", results);
      res.status(200).json({ message: "Success", data: results });
    });
  } catch (error) {
    console.log(error);
    const errorMessage = { message: error.message, stack: error.stack };
    res.status(500).json({ error: errorMessage });
  }
};
