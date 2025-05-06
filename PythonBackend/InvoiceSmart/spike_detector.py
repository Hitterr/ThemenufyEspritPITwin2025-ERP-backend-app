from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS


import statistics

app = Flask(__name__)
client = MongoClient("mongodb://localhost:27017")
db = client["the-menufy"]
CORS(app)

@app.route('/api/detect_spike', methods=['POST'])
def detect_spike():
    data = request.json
    stock_id = data.get("stockId")
    invoice_price = data.get("price")

    if not stock_id or invoice_price is None:
        return jsonify({"error": "stockId and price are required"}), 400

    # Obtenir les factures valides
    valid_invoice_ids = db.invoices.find(
        {"status": "delivered"},
        {"_id": 1}
    )
    valid_ids = [doc["_id"] for doc in valid_invoice_ids]
    
    # Chercher l’historique des prix valides
    history_cursor = db.pricehistories.find({
        "stockId": ObjectId(stock_id)
    }).sort("createdAt", -1).limit(5)
    history_prices = [doc["price"] for doc in history_cursor]
    
    if not history_prices:
        return jsonify({"isSpike": False, "reason": "No valid history"})

    avg_price = statistics.mean(history_prices)
    is_spike = invoice_price > avg_price * 2

    return jsonify({
        "stockId": stock_id,
        "price": invoice_price,
        "averagePrice": round(avg_price, 2),
        "isSpike": is_spike
    })

if __name__ == '__main__':
    app.run(debug=True)
