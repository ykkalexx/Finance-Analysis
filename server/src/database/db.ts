import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const connectDB = new Promise<void>((resolve, reject) => {
  db.connect((err) => {
    if (err) {
      console.error("Unable to connect to the database:", err);
      reject(err);
      return;
    }
    console.log("Connected to MySQL db!");
    resolve();
  });
});

export default db;
