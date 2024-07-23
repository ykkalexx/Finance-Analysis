import boto3
import pandas as pd
import json
from io import StringIO
from datetime import datetime, timedelta

s3 = boto3.client('s3')

def lambda_handler(event, context):
    # Get the current year and month
    now = datetime.now()
    year, month = now.year, now.month

    # Define the file name based on the current year and month
    file_name = f'{year}_{month}_transactions.csv'

    # Get the CSV file from S3
    bucket_name = "frauddetectorfileholder"
    file_obj = s3.get_object(Bucket=bucket_name, Key=file_name)
    file_content = file_obj['Body'].read().decode('utf-8')

    # Read the CSV data into a pandas DataFrame
    data = pd.read_csv(StringIO(file_content))

    # Calculate the sum of the 'transaction_amount' column
    monthly_sum = data['transaction_amount'].sum()

    # Convert the result into a JSON format
    result = json.dumps({'monthly_sum': str(monthly_sum)})

    return result