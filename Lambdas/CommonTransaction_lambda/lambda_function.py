import boto3
import re
import pandas as pd
from io import StringIO

s3 = boto3.client('s3')

def lambda_handler(event, context):
    bucket_name = "frauddetectorfileholder"

    # List all files in the bucket
    files = s3.list_objects(Bucket=bucket_name)['Contents']

    pattern = re.compile(r'\d{6}_\d{4}_\d+_transactions.csv')
    files = [file['Key'] for file in files if pattern.match(file['Key'])]

    result = []

    for file_name in files:
        customer_no = file_name.split('_')[0]
        file_obj = s3.get_object(Bucket=bucket_name, Key=file_name)
        file_content = file_obj['Body'].read().decode('utf-8')

        data = pd.read_csv(StringIO(file_content))

        common_type = data['transaction_type'].mode()[0]

        result.append({'common_transaction_type': common_type, 'customer_number': customer_no})

    return result