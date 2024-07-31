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

def generate_fake_data(year, month, transaction_id=None):
    # Generate a random day within the month
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year+1, 1, 1)
    else:
        end_date = datetime(year, month+1, 1)
    transaction_time = start_date + (end_date - start_date) * random.random()

    # Generate a random transaction amount
    # 5% of transactions are large (amount between 1000 and 10000)
    # 5% of transactions are unusual (negative amount)
    rand = random.random()
    if rand < 0.05:
        amount = round(random.uniform(1000, 10000), 2)
    elif rand < 0.10:
        amount = round(random.uniform(-100, -1), 2)
    else:
        amount = round(random.uniform(1, 100), 2)

    # 5% of transactions have a missing transaction type
    if random.random() < 0.05:
        transaction_type = None
    else:
        transaction_type = random.choice(transactions_type)

    return {
        'transaction_id': transaction_id if transaction_id is not None else fake.unique.random_number(digits=5),
        'user_id': fake.random_number(digits=3),
        'transaction_amount': amount,
        'transaction_time': transaction_time,
        'transaction_type': transaction_type
    }

# Get the current year and month
now = datetime.now()
year, month = now.year, now.month

# Generate customer no.
customer_no = fake.random_number(digits=6)

# Generate 950 unique transactions and 50 duplicates
transactions = [generate_fake_data(year, month) for _ in range(950)]
duplicates = [generate_fake_data(year, month, transaction['transaction_id']) for transaction in random.choices(transactions, k=50)]
transactions.extend(duplicates)

# Write the transactions to a CSV file
with open(f'{customer_no}_{year}_{month}_transactions.csv', 'w', newline='') as csvfile:
    fieldnames = ['transaction_id', 'user_id', 'transaction_amount', 'transaction_time', 'transaction_type']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for transaction in transactions:
        writer.writerow(transaction)

session = boto3.Session(
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('AWS_SECRET_KEY'),
    region_name=os.getenv('AWS_REGION')
)

bucket_name=os.getenv('AWS_BUCKET_NAME')

# Upload the CSV file to an S3 bucket
s3 = session.client('s3')
with open(f'{customer_no}_{year}_{month}_transactions.csv', 'rb') as data:
    s3.upload_fileobj(data, bucket_name, f'{customer_no}_{year}_{month}_transactions.csv')