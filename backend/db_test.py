from db import get_db_connection

connection = get_db_connection()

print("Connected Successfuly!");

connection.close();