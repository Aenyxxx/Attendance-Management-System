from db import get_db_connection

def get_categories():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT id, name
        FROM public.categories
        ORDER BY id;
    """)

    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    return rows

def get_transactions():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("""
    SELECT id, description, amount, transaction_type, status
    FROM public.transaction
    ORDER BY id;
    """)

    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    return rows