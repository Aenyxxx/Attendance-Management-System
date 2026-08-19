from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/")
def home():
    return "BeigePay backend is running!"

@app.route("/api/test")
def api_test():
    return jsonify ({
        "message": "API is working"
    })

if __name__ == "__main__":
    app.run(debug=True)