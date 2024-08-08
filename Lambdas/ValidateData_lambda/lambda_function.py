import boto3
import pandas as pd
import json
from io import StringIO
import re

s3 = boto3.client('s3')

def lambda_handlers(event, context):
    bucket_name = "frauddetectorfileholder"

    files = s3.list_objects(Bucket=bucket_name)['Contents']
    pattern = re.compile(r'\d{6}_\d{4}_\d+_transactions.csv')
    files = [file['Key'] for file in files if pattern.match(file['Key'])]

    result = []

    for file_name in files:
        # Extract the customer number from the file name
        customer_no = file_name.split('_')[0]