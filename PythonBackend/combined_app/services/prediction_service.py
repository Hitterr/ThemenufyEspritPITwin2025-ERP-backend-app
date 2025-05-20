from flask import request, jsonify
from prophet import Prophet
from bson.objectid import ObjectId
import pandas as pd
from datetime import datetime

# Global variables
prediction_app = None
prediction_db = None
consumption_collection = None
stock_collection = None

def setup_prediction(app, db):
    global prediction_app, prediction_db, consumption_collection, stock_collection
    prediction_app = app
    prediction_db = db
    consumption_collection = db["consumptionhistories"]
    stock_collection = db["stocks"]

def register_routes(app):
    @app.route('/predict/consumption', methods=['POST'])
    def predict():
        try:
            data = request.get_json()
            stock_id_str = data.get('stockId')
            days = int(data.get('days', 7))
            start_date_str = data.get('startDate')

            if not stock_id_str:
                return jsonify({"success": False, "error": "stockId is required."}), 400

            stock_id = ObjectId(stock_id_str)

            # 1. Récupération des données historiques
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

            # 5. Création du DataFrame pour les prédictions à partir de startDate
            if start_date_str:
                start_date = pd.to_datetime(start_date_str)  # Convertir startDate en datetime
            else:
                start_date = datetime.now()  # Si startDate n'est pas fourni, utiliser la date actuelle

            # Créer un DataFrame pour les dates futures à partir de startDate
            future_dates = pd.date_range(start=start_date, periods=days, freq='D')
            future = pd.DataFrame({'ds': future_dates})

            # Ajouter les colonnes floor et cap
            future['floor'] = 0
            future['cap'] = df['y'].max() * 2

            # 6. Prédiction
            forecast = model.predict(future)
            prediction_values = [
                {"ds": p['ds'].strftime('%a, %d %b %Y %H:%M:%S GMT'), "yhat": max(0, p['yhat'])}
                for p in forecast[['ds', 'yhat']].to_dict(orient='records')
            ]

            # 7. Stock actuel
            stock = stock_collection.find_one({"_id": stock_id})
            if not stock:
                return jsonify({"success": False, "error": "Stock not found."}), 404

            current_stock = stock.get("quantity", 0)
            unit = stock.get("unit", "units")
            price = stock.get("price", "price")  
      
            total_predicted_qty = sum(p['yhat'] for p in prediction_values)
            missing_qty = max(0, total_predicted_qty - current_stock)

            # 8. Réponse
            return jsonify({
                "success": True,
                "stockId": stock_id_str,
                "days": days,
                "predictions": prediction_values,
                "totalForecastedQty": round(total_predicted_qty, 2),
                "currentStock": current_stock,
                "unit": unit,
                "price": price,
                "missingQty": round(missing_qty, 2)
            })

        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500