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

    result = []

    for file_name in files:
        obj = s3.get_object(Bucket=bucket_name, Key=file_name)
        df = pd.read_csv(obj['Body'])

        duplicates = df[df.duplicated(subset='transaction_id')]
        duplicates_msg = ''
        if not duplicates.empty:
            duplicates_msg = (f"Found {len(duplicates)} duplicate rows in file {file_name}")

        missing = df[df.isnull().any(axis=1)]
        missing_msg = ''
        if not missing.empty:
            missing_msg = (f"Found {len(missing)} missing entries in file {file_name}")

        unusual = df[(df['transaction_amount'] < 0) | (df['transaction_amount'] > 10000) | (df['transaction_amount'].between(1000, 10000))]
        unusual_msg = ''
        if not unusual.empty:
            unusual_msg = (f"Found {len(unusual)} unusual amounts in file {file_name}")

        result = {
            'duplicates': {
                'count': len(duplicates),
                'transaction_ids': duplicates['transaction_id'].tolist(),
                'message' : duplicates_msg
            },
            'missing': {
                'count': len(missing),
                'transaction_ids': missing['transaction_id'].tolist(),
                'message' : missing_msg
            },
            'unusual': {
                'count': len(unusual),
                'transaction_ids': unusual['transaction_id'].tolist(),
                'message' : unusual_msg
            },
            'customer_number': customer_no
        }

    return result