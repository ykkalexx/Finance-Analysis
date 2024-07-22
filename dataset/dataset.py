from faker import Faker
import random
import csv
import boto3
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

load_dotenv() 
fake = Faker()

transactions_type = ["transport","entertainment","services","travel","health"]

def generate_fake_data(year, month):
    # All transactions are normal (amount between 1 and 100)
    amount = round(random.uniform(1, 100), 2)

    # Generate a random day within the month
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year+1, 1, 1)
    else:
        end_date = datetime(year, month+1, 1)
    transaction_time = start_date + (end_date - start_date) * random.random()

    return {
        'transaction_id': fake.unique.random_number(digits=5),
        'user_id': fake.random_number(digits=3),
        'transaction_amount': amount,
        'transaction_time': transaction_time,
        'transaction_type': random.choice(transactions_type)
    }

# Get the current year and month
now = datetime.now()
year, month = now.year, now.month

# Generate 1000 transactions and write to a CSV file
with open(f'{year}_{month}_transactions.csv', 'w', newline='') as csvfile:
    fieldnames = ['transaction_id', 'user_id', 'transaction_amount', 'transaction_time', 'transaction_type']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for _ in range(1000):
        writer.writerow(generate_fake_data(year, month))


session = boto3.Session(
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('AWS_SECRET_KEY'),
    region_name=os.getenv('AWS_REGION')
)

bucket_name=os.getenv('AWS_BUCKET_NAME')

# Upload the CSV file to an S3 bucket
s3 = session.client('s3')
with open(f'{year}_{month}_transactions.csv', 'rb') as data:
    s3.upload_fileobj(data, bucket_name, f'{year}_{month}_transactions.csv')