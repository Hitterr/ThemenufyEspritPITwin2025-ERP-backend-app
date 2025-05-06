from flask import Flask, request, jsonify
from prophet import Prophet
from pymongo import MongoClient
from bson import ObjectId
import pandas as pd
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)

# Connexion MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["the-menufy"]
consumption_collection = db["consumptionhistories"]
stock_collection = db["stocks"]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        stock_id_str = data.get('stockId')
        days = int(data.get('days', 7))

        if not stock_id_str:
            return jsonify({"success": False, "error": "stockId is required."}), 400

        stock_id = ObjectId(stock_id_str)

        # 1. Récupération des données
        consumption_data = list(consumption_collection.find({"stockId": stock_id}))
        if not consumption_data:
            return jsonify({"success": False, "error": "No consumption history found."}), 404

        # 2. Transformation en DataFrame
        df = pd.DataFrame([{
            "ds": pd.to_datetime(entry["createdAt"], errors='coerce'),
            "y": pd.to_numeric(entry["qty"], errors='coerce')
        } for entry in consumption_data])

        # 3. Nettoyage des données
        df = df[df['ds'].notna() & df['y'].notna()]
        df = df[df['y'] >= 0]
        df = df.drop_duplicates(subset=['ds'])
        df = df.sort_values('ds')

        if len(df) < 2:
            return jsonify({
                "success": False,
                "error": f"At least 2 data points required. Found {len(df)}."
            }), 400
        if df['y'].nunique() == 1 or df['y'].std() < 0.1:
            return jsonify({"success": False, "error": "Data has too little variance."}), 400

        # 4. Modèle Prophet avec contrainte logistique
        df['floor'] = 0
        df['cap'] = df['y'].max() * 2
        model = Prophet(growth='logistic', weekly_seasonality=True, changepoint_prior_scale=0.05)
        model.fit(df)

        # 5. Prédiction
        future = model.make_future_dataframe(periods=days)
        future['floor'] = 0
        future['cap'] = df['y'].max() * 2
        forecast = model.predict(future)
        prediction_values = [
            {"ds": p['ds'].strftime('%a, %d %b %Y %H:%M:%S GMT'), "yhat": max(0, p['yhat'])}
            for p in forecast.tail(days)[['ds', 'yhat']].to_dict(orient='records')
        ]

        # 6. Stock actuel
        stock = stock_collection.find_one({"_id": stock_id})
        if not stock:
            return jsonify({"success": False, "error": "Stock not found."}), 404

        current_stock = stock.get("quantity", 0)
        total_predicted_qty = sum(p['yhat'] for p in prediction_values)
        missing_qty = max(0, total_predicted_qty - current_stock)

        # 7. Réponse
        return jsonify({
            "success": True,
            "stockId": stock_id_str,
            "days": days,
            "predictions": prediction_values,
            "totalForecastedQty": round(total_predicted_qty, 2),
            "currentStock": current_stock,
            "missingQty": round(missing_qty, 2)
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True, port=5001)
