import os

import psycopg
from dotenv import load_dotenv

load_dotenv()

try:
    connection = psycopg.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )

    print("Database connection successful!")

    cursor = connection.cursor()

    cursor.execute("""
    SELECT
        public.transaction.id,
        public.transaction.description,
        public.transaction.amount,
        public.categories.name
    FROM public.transaction
    JOIN public.categories
        ON public.transaction.category_id = public.categories.id
    WHERE public.transaction.status = 'Completed';
    """)
    transactions = cursor.fetchall()

    print("Tables in the public schema:")
    for transac in transactions:
        print(transac)

    cursor.close()
    connection.close()
except Exception as error:
    print("Database connection failed!")
    print(error)