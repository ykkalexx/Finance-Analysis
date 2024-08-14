## Finance Analysis Backend App

The Transaction Data Analyzer Backend is a backend application developed to analyze and provide insights from user transaction data. This project processes transaction sheets, deriving valuable insights such as monthly sums, common transaction types, and more. The application exposes a RESTful API, leveraging the power of Node.js for efficient data handling and AWS Lambda for scalable, serverless computing.

## This project serves as a portfolio showcase, highlighting my proficiency in:

Back-end web development
Node.js
Python
AWS Lambda and serverless architecture
MySQL & SQL
Data processing and analysis

## Features

- Transaction Data Processing: Upload and analyze transaction sheets to extract valuable insights.
- Monthly Summaries: Calculate and return the sum of transactions for each month.
- Transaction Type Analysis: Identify and categorize common transaction types.
- Data Integrity Checks: Analyze data to detect and return duplicates, suspicious amounts, and missing amounts.
- Scalable Architecture: Utilize AWS Lambda functions for processing to ensure scalability and efficiency.
- RESTful API: Interact with the application through a robust and well-documented API.

## API Endpoints

For Data routes:

- POST "/monthly-sum", send a customer number to return the sum of transactions for the month for the specified customer.

- POST "/monthly-common", send a customer number to return the most common transaction type for the specified customer

- POST "/analyze", send a customer number to return the data integrity checks

For User routes:

- POST "/create-user", this route its used to create the a new customer and assign a customer number, also its used to create the transaction sheet for the customer number, stored in S3

- GET "/user/:customer_number", used to return everything stored in the database in relation to the customer number
