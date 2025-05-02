from flask import Flask, request, jsonify
from prophet import Prophet
from pymongo import MongoClient
from bson import ObjectId
import pandas as pd
from flask_cors import CORS  


app = Flask(__name__)
CORS(app)  # ← Autorise toutes les origines (CORS)


# Connexion MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["the-menufy"]
consumption_collection = db["consumptionhistories"]
ingredient_collection = db["ingredients"]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        ingredient_id_str = data.get('ingredientId')
        days = int(data.get('days', 7))

        if not ingredient_id_str:
            return jsonify({"success": False, "error": "ingredientId is required."}), 400

        try:
            ingredient_id = ObjectId(ingredient_id_str)
        except:
            return jsonify({"success": False, "error": "Invalid ingredientId format."}), 400

        # 1. Récupération historique consommation
        consumption_data = list(consumption_collection.find({
            "ingredientId": ingredient_id
        }))

        if not consumption_data:
            return jsonify({"success": False, "error": "No consumption history found for this ingredient."}), 404

        # 2. Transformation en DataFrame
        df = pd.DataFrame([{
            "ds": pd.to_datetime(entry["createdAt"]),
            "y": entry["qty"]
        } for entry in consumption_data])

        df.dropna(inplace=True)
        if len(df) < 2:
            return jsonify({"success": False, "error": "Not enough data points for prediction."}), 400

        # 3. Prophet forecast
        model = Prophet()
        model.fit(df)
        future = model.make_future_dataframe(periods=days)
        forecast = model.predict(future)
        prediction_values = forecast.tail(days)[['ds', 'yhat']].to_dict(orient='records')

        # 4. Récupération stock actuel
        ingredient = ingredient_collection.find_one({ "_id": ingredient_id })
        if not ingredient:
            return jsonify({"success": False, "error": "Ingredient not found."}), 404

        current_stock = ingredient.get("quantity", 0)

        # 5. Total prédit et manque
        total_predicted_qty = sum(p['yhat'] for p in prediction_values)
        missing_qty = max(0, total_predicted_qty - current_stock)

        # 6. Réponse
        return jsonify({
            "success": True,
            "ingredientId": ingredient_id_str,
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
