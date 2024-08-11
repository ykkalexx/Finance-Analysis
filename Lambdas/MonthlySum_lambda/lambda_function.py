import boto3
import pandas as pd
import json
from io import StringIO
import re

s3 = boto3.client('s3')

def lambda_handler(event, context):
    bucket_name = "frauddetectorfileholder"
    
    customer_no = event.get('customer_number')

    files = s3.list_objects(Bucket=bucket_name)['Contents']

    pattern = re.compile(rf'{customer_no}_\d{{4}}_\d+_transactions.csv')
    files = [file['Key'] for file in files if pattern.match(file['Key'])]

    results = []

    for file_name in files:
        # Get the CSV file from S3
        file_obj = s3.get_object(Bucket=bucket_name, Key=file_name)
        file_content = file_obj['Body'].read().decode('utf-8')

        # Read the CSV data into a pandas DataFrame
        data = pd.read_csv(StringIO(file_content))

        # Calculate the sum of the 'transaction_amount' column
        monthly_sum = data['transaction_amount'].sum()

        # Convert the result into a JSON format
        result = {'monthly_sum': str(monthly_sum), 'customer_number': customer_no}
        results.append(result)

    return results