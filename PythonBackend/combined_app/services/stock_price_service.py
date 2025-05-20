from flask import request, jsonify
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBClassifier
from statsmodels.tsa.api import SimpleExpSmoothing
from sklearn.preprocessing import StandardScaler
from bson.objectid import ObjectId

# Global variables
stock_app = None
stock_db = None

def setup_stock_price(app, db):
    global stock_app, stock_db
    stock_app = app
    stock_db = db

def calculate_volatility_features(df):
    # Check if 'price' column exists, if not, try to find the correct column name
    if 'price' not in df.columns:
        # Common alternative column names for price
        price_columns = ['price', 'unitPrice', 'unit_price', 'amount', 'value']
        for col in price_columns:
            if col in df.columns:
                df['price'] = df[col]
                break
        # If still no price column, create a dummy one for testing
        if 'price' not in df.columns and len(df) > 0:
            print("Warning: No price column found. Using a placeholder for testing.")
            df['price'] = 100.0  # Default value for testing
    
    # Volatility metrics
    df['price_std'] = df['price'].rolling(30, min_periods=1).std()
    df['max_drawdown'] = (df['price'].expanding().max() - df['price']).max()
    df['daily_returns'] = df['price'].pct_change().abs()
    df['volatility_30'] = df['daily_returns'].rolling(30, min_periods=1).std()
    df['volatility_7'] = df['daily_returns'].rolling(7, min_periods=1).std()
    return df[['price_std', 'max_drawdown', 'volatility_30', 'volatility_7']]

def train_volatility_model(df):
    X = calculate_volatility_features(df)
    volatility_score = df['price_std']  # Use rolling price standard deviation
    
    # Create classes using quantiles
    df['volatility_class'] = pd.qcut(volatility_score, q=3, labels=['low', 'medium', 'high'], duplicates='drop')
    valid_data = df.dropna(subset=['volatility_class'])
    if len(valid_data) < 3:
        raise ValueError("Insufficient valid data points for classification after cleaning")
    y = valid_data['volatility_class'].cat.codes
    X = valid_data[['price_std', 'max_drawdown', 'volatility_30', 'volatility_7']]
    
    model = XGBClassifier(n_estimators=100, learning_rate=0.1, random_state=42)
    model.fit(X, y)
    return model

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

def register_routes(app):
    @app.route('/stock/predict', methods=['GET'])
    def predict_price():
        stock_id = request.args.get('stockId')
        restaurant_id = request.args.get('restaurantId')
        days_ahead = int(request.args.get('days', 7))  # Default to 7 days ahead
        if not stock_id or not restaurant_id:
            return jsonify({'error': 'stockId and restaurantId parameters are required'}), 400
        # Fetch historical data
        records = list(stock_db.pricehistories.find({
            'stockId': ObjectId(stock_id),
            'restaurantId': ObjectId(restaurant_id)
        }))

        if not records:
            return jsonify({'error': 'No data found for the given stockId and restaurantId'}), 404
        # Prepare data for model
        df = pd.DataFrame(records)
        model, scaler = train_model(df)
        # Predict future price
        future_date = datetime.utcnow() + timedelta(days=days_ahead)
        # Calculate features for prediction
        days_since_first = (future_date - df['createdAt'].min()).days
        
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
        # In predict_price route after prediction:
        # Collect individual tree predictions
        tree_preds = [tree.predict(scaled_features)[0] for tree in model.estimators_]
        std_dev = np.std(tree_preds)
        mean_price = np.mean(tree_preds)
        
        # Calculate confidence percentage 
        confidence_percentage = (1 - (std_dev / (mean_price if mean_price != 0 else 1))) * 100
        confidence_percentage = max(0, min(100, round(confidence_percentage, 2)))
        
        # Initialize response data first
        response_data = {
            'stockId': stock_id,
            'restaurantId': restaurant_id,
            'predicted_price': round(predicted_price, 2),
            'confidence': confidence_percentage,
            'predicted_date': future_date.isoformat()
        }
        
        # Handle warnings after initialization
        if warning:
            response_data['warning'] = warning
        
        return jsonify(response_data)

    @app.route('/stock/volatility', methods=['GET'])
    def get_volatility_classification():
        stock_id = request.args.get('stockId')
        restaurant_id = request.args.get('restaurantId')
        
        if not stock_id or not restaurant_id:
            return jsonify({'error': 'Missing stockId or restaurantId'}), 400
        
        try:
            records = list(stock_db.pricehistories.find({
                'stockId': ObjectId(stock_id),
                'restaurantId': ObjectId(restaurant_id)
            }))
            
            if not records:
                return jsonify({
                    'stockId': stock_id,
                    'restaurantId': restaurant_id,
                    'volatility_class': 'unknown',
                    'confidence': 0.0,
                    'error': 'No price history found for this stock'
                }), 404
            
            df = pd.DataFrame(records)
            
            # Debug information
            print(f"DataFrame columns: {df.columns.tolist()}")
            print(f"DataFrame shape: {df.shape}")
            
            # Calculate features and train model
            X = calculate_volatility_features(df)
            model = train_volatility_model(df)
            
            # Get latest volatility features
            latest_features = X.iloc[-1:]
            prediction = model.predict(latest_features)[0]
            classes = ['low', 'medium', 'high']
            
            return jsonify({
                'stockId': stock_id,
                'restaurantId': restaurant_id,
                'volatility_class': classes[prediction],
                'confidence': float(model.predict_proba(latest_features)[0].max())
            })
        
        except Exception as e:
            print(f"Error in volatility classification: {str(e)}")
            return jsonify({
                'stockId': stock_id,
                'restaurantId': restaurant_id,
                'volatility_class': 'error',
                'confidence': 0.0,
                'error': str(e)
            }), 500