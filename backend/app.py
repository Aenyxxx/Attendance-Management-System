from flask import Flask, jsonify
import os
import psycopg
from dotenv import load_dotenv
from queries import get_categories
from queries import get_transactions

load_dotenv()

app = Flask(__name__)
app.json.sort_keys = False

@app.route("/")
def home():
    return "BeigePay backend is running!"

@app.route("/api/test")
def api_test():
    return jsonify ({
        "message": "API is working"
    })

@app.route("/api/categories")
def categories():
    rows = get_categories()
    categories = []

    for row in rows:
        category = {
            "id":row[0],
            "name":row[1]
        }

        categories.append(category)
    return jsonify(categories)

@app.route("/api/transaction")
def transactions():
    rows = get_transactions()

    transactions = []

    for tran in rows:
        transac = {
            "id":tran[0],
            "description":tran[1],
            "amount":tran[2],
            "transaction_type":tran[3],
            "status":tran[4]
        }
        transactions.append(transac)
    return jsonify(transactions)

if __name__ == "__main__":
    app.run(debug=True)