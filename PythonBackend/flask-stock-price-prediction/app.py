from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import pandas as pd
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from statsmodels.tsa.api import SimpleExpSmoothing
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import os
app = Flask(__name__)
app.config["MONGO_URI"] = os.environ.get("MONGO_URI", "mongodb://localhost:27017/the-menufy")
mongo = PyMongo(app)
def train_model(df):
    df['createdAt'] = pd.to_datetime(df['createdAt'])
    df.sort_values('createdAt', inplace=True)
    
    # Feature engineering
    df['days_since_first'] = (df['createdAt'] - df['createdAt'].min()).dt.days
    df['moving_avg_7'] = df['price'].rolling(window=7, min_periods=1).mean()
    df['moving_avg_30'] = df['price'].rolling(window=30, min_periods=1).mean()
    
    # Exponential smoothing
    fit = SimpleExpSmoothing(df['price']).fit(smoothing_level=0.2)
    df['exp_smoothed'] = fit.fittedvalues
    
    X = df[['days_since_first', 'moving_avg_7', 'moving_avg_30', 'exp_smoothed']]
    y = df['price']
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_scaled, y)
    return model, scaler
@app.route('/predict', methods=['GET'])
def predict_price():
    stock_id = request.args.get('stockId')
    restaurant_id = request.args.get('restaurantId')
    days_ahead = int(request.args.get('days', 7))  # Default to 7 days ahead
    if not stock_id or not restaurant_id:
        return jsonify({'error': 'stockId and restaurantId parameters are required'}), 400
    # Fetch historical data
    records = list(mongo.db.pricehistories.find({
        'stockId': ObjectId(stock_id),
        'restaurantId': ObjectId(restaurant_id)
    }))
    print(records)
    if not records:
        return jsonify({'error': 'No data found for the given stockId and restaurantId'}), 404
    # Prepare data for model
    df = pd.DataFrame(records)
    model, scaler = train_model(df)
    # Predict future price
    future_date = datetime.utcnow() + timedelta(days=days_ahead)
    # Calculate features for prediction
    days_since_first = (future_date - df['createdAt'].min()).days
    # Added data validation checks
    if len(records) < 30:
        return jsonify({'warning': 'Limited historical data ({} records), predictions may be less accurate'.format(len(records))}), 200
    
    # Enhanced feature calculation with fallbacks
    moving_avg_7 = df['price'].tail(7).mean() if len(df) >=7 else df['price'].mean()
    moving_avg_30 = df['price'].tail(30).mean() if len(df)>=30 else moving_avg_7
    exp_smoothed = df['exp_smoothed'].iloc[-1]
    
    scaled_features = scaler.transform([[days_since_first, moving_avg_7, moving_avg_30, exp_smoothed]])
    predicted_price = model.predict(scaled_features)[0]
    if predicted_price < 0:
        predicted_price = 0.0
        warning = "Predicted price adjusted to 0.00 due to negative value"
    else:
        warning = None
    response_data = {
        'stockId': stock_id,
        'restaurantId': restaurant_id,
        'predicted_price': round(predicted_price, 2),
        'predicted_date': future_date.isoformat()
    }
    if 'warning' in locals():
        response_data['warning'] = warning
    return jsonify(response_data)
if __name__ == '__main__':
    app.run(debug=True)
