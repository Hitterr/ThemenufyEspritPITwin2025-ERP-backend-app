import sys
import time
from pymongo import MongoClient
import pandas as pd
from prophet import Prophet
from prophet.diagnostics import cross_validation, performance_metrics
from datetime import datetime, timedelta
import json
from bson.objectid import ObjectId
import numpy as np

print("Python script started", file=sys.stdout, flush=True)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["the-menufy"]
print(f"Connected to MongoDB: {client.address}, Database: {db.name}", file=sys.stdout, flush=True)
print("MongoDB collections:", db.list_collection_names(), file=sys.stdout, flush=True)

# Fetch consumption history
def get_consumption_data(stock_id, restaurant_id):
    start_time = time.time()
    print(f"Fetching consumption data for stockId: {stock_id}, restaurantId: {restaurant_id}", file=sys.stdout, flush=True)
    pipeline = [
        {"$match": {"stockId": ObjectId(stock_id), "restaurantId": ObjectId(restaurant_id)}},
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$createdAt"}},
            "total_qty": {"$sum": "$qty"}
        }},
        {"$sort": {"_id": 1}}
    ]
    data = list(db.consumptionhistories.aggregate(pipeline))
    df = pd.DataFrame(data)
    if not df.empty:
        df["ds"] = pd.to_datetime(df["_id"])
        df["y"] = df["total_qty"]
    print(f"Consumption data fetched: {len(df)} records in {time.time() - start_time:.2f} seconds", file=sys.stdout, flush=True)
    return df[["ds", "y"]] if not df.empty else pd.DataFrame({"ds": [], "y": []})

# Forecast demand using Prophet
def forecast_demand(df, forecast_horizon=30):
    start_time = time.time()
    print("Starting Prophet forecast", file=sys.stdout, flush=True)
    
    if len(df) < 30:
        print("Warning: Insufficient data for reliable forecasting (<30 days)", file=sys.stdout, flush=True)
        return pd.DataFrame({"ds": [], "yhat": []})
    
    # Preprocess data: Cap outliers at 3 standard deviations
    df = df.copy()
    mean_y = df["y"].mean()
    std_y = df["y"].std()
    df["y"] = np.clip(df["y"], mean_y - 3 * std_y, mean_y + 3 * std_y)
    
    # Initialize Prophet model with tuned parameters
    model = Prophet(
        daily_seasonality=True,
        weekly_seasonality=True,
        yearly_seasonality=True,
        changepoint_prior_scale=0.05,  # Increase flexibility for trend changes
        seasonality_prior_scale=10.0,  # Moderate seasonality strength
        holidays_prior_scale=10.0       # Moderate holiday effect strength
    )
    
    # Add custom monthly seasonality
    model.add_seasonality(name='monthly', period=30.5, fourier_order=5)
    
    # Add holidays (example: U.S. holidays, customizable)
    holidays = pd.DataFrame({
        'holiday': 'major_holidays',
        'ds': pd.to_datetime([
            '2024-12-25', '2025-12-25',  # Christmas
            '2024-07-04', '2025-07-04',  # Independence Day
            '2024-11-28', '2025-11-27',  # Thanksgiving
            '2024-01-01', '2025-01-01'   # New Year's Day
        ]),
        'lower_window': -1,  # Include day before
        'upper_window': 1    # Include day after
    })
    model.holidays = holidays
    
    # Fit the model
    model.fit(df)
    
    # Perform cross-validation to evaluate model performance
    try:
        df_cv = cross_validation(
            model,
            initial='90 days',
            period='30 days',
            horizon='30 days',
            disable_tqdm=True
        )
        df_performance = performance_metrics(df_cv, rolling_window=1)
        rmse = df_performance['rmse'].values[0]
        print(f"Cross-validation RMSE: {rmse:.2f}", file=sys.stdout, flush=True)
    except Exception as e:
        print(f"Cross-validation failed: {str(e)}", file=sys.stdout, flush=True)
    
    # Generate future dataframe and predict
    future = model.make_future_dataframe(periods=forecast_horizon)
    forecast = model.predict(future)
    
    # Ensure non-negative forecasts
    forecast["yhat"] = forecast["yhat"].clip(lower=0)
    
    print(f"Prophet forecast completed in {time.time() - start_time:.2f} seconds", file=sys.stdout, flush=True)
    return forecast[["ds", "yhat"]].tail(forecast_horizon)

# Helper function to find the next delivery date
def get_next_delivery_date(start_date, lead_time_days, delivery_schedule):
    if not delivery_schedule:  # If no schedule, any day is valid
        return start_date + timedelta(days=lead_time_days)
    
    # Map weekday names to numbers (0=Monday, 6=Sunday)
    weekday_map = {
        "Monday": 0, "Tuesday": 1, "Wednesday": 2, "Thursday": 3,
        "Friday": 4, "Saturday": 5, "Sunday": 6
    }
    valid_weekdays = [weekday_map[day] for day in delivery_schedule]
    
    current_date = start_date
    days_ahead = 0
    
    # Find the next valid delivery date after lead_time_days
    while days_ahead < lead_time_days or current_date.weekday() not in valid_weekdays:
        current_date += timedelta(days=1)
        days_ahead += 1
    
    return current_date

# Calculate reorder recommendations
def calculate_reorder(stock_id, restaurant_id, forecast_horizon=30):
    start_time = time.time()
    print(f"Calculating reorder for stockId: {stock_id}", file=sys.stdout, flush=True)
    stock = db.stocks.find_one({"_id": ObjectId(stock_id), "restaurant": ObjectId(restaurant_id)})
    if not stock:
        error_msg = f"Error: Stock not found for stockId: {stock_id}, restaurantId: {restaurant_id}"
        print(error_msg, file=sys.stdout, flush=True)
        return {"error": error_msg}

    supplier = db.suppliers.find_one({"stocks.stockId": ObjectId(stock_id)})
    if not supplier:
        error_msg = f"Error: Supplier not found for stockId: {stock_id}"
        print(error_msg, file=sys.stdout, flush=True)
        return {"error": error_msg}
    
    supplier_stock = next(s for s in supplier["stocks"] if str(s["stockId"]) == stock_id)
    delivery_schedule = supplier.get("deliverySchedule", [])  # Fetch delivery schedule
    print(f"Stock and supplier data fetched in {time.time() - start_time:.2f} seconds", file=sys.stdout, flush=True)

    consumption_df = get_consumption_data(stock_id, restaurant_id)
    if consumption_df.empty:
        error_msg = "Error: No consumption history available"
        print(error_msg, file=sys.stdout, flush=True)
        return {"error": error_msg}

    forecast = forecast_demand(consumption_df, forecast_horizon)
    if forecast.empty:
        error_msg = "Error: Insufficient data for forecasting"
        print(error_msg, file=sys.stdout, flush=True)
        return {"error": error_msg}

    daily_demand = forecast["yhat"].mean()
    print(f"Daily demand: {daily_demand:.2f} in {time.time() - start_time:.2f} seconds", file=sys.stdout, flush=True)

    lead_time_days = supplier_stock["leadTimeDays"]
    safety_stock = daily_demand * lead_time_days * 0.2
    reorder_point = (daily_demand * lead_time_days) + safety_stock

    current_quantity = stock["quantity"]
    min_qty = stock["minQty"]
    max_qty = stock["maxQty"]
    moq = supplier_stock["moq"]
    shelf_life_days = stock["shelfLifeDays"]

    result = {"stock": stock["libelle"], "alert": None}

    days_until_depletion = current_quantity / daily_demand if daily_demand > 0 else float("inf")
    
    # Calculate dynamic order_date
    if days_until_depletion == float("inf"):
        order_date = get_next_delivery_date(datetime.now(), 30, delivery_schedule)
    else:
        days_to_order = max(days_until_depletion - lead_time_days, 0)
        tentative_order_date = datetime.now() + timedelta(days=days_to_order)
        order_date = get_next_delivery_date(tentative_order_date, lead_time_days, delivery_schedule)

    order_quantity = max(
        moq,
        min(
            (daily_demand * 30 + safety_stock) - current_quantity,
            max_qty,
            daily_demand * shelf_life_days
        )
    )

    if current_quantity < reorder_point:
        if current_quantity < (daily_demand * lead_time_days):
            result["alert"] = f"Urgent: {stock['libelle']} stock too low! Order {order_quantity:.2f} by {order_date.strftime('%Y-%m-%d')}."

    result.update({
        "order_date": order_date.isoformat(),
        "quantity": round(order_quantity, 2),
        "supplier_id": str(supplier["_id"]),
        "unit": stock["unit"],
        "consumption": consumption_df.to_dict(orient="records"),
        "forecast": forecast.to_dict(orient="records"),
    })

    print(f"Reorder calculation completed in {time.time() - start_time:.2f} seconds", file=sys.stdout, flush=True)
    return result

# Optimize supplier selection
def optimize_supplier(stock_id):
    start_time = time.time()
    print(f"Optimizing supplier for stockId: {stock_id}", file=sys.stdout, flush=True)
    suppliers = db.suppliers.find({"stocks.stockId": ObjectId(stock_id)})
    best_supplier = None
    min_cost = float("inf")

    for supplier in suppliers:
        stock_data = next(s for s in supplier["stocks"] if str(s["stockId"]) == stock_id)
        cost = stock_data["pricePerUnit"] * (1 + stock_data["leadTimeDays"] / 30)
        if cost < min_cost:
            min_cost = cost
            best_supplier = supplier

    supplier_id = str(best_supplier["_id"]) if best_supplier else None
    print(f"Best supplier: {supplier_id} in {time.time() - start_time:.2f} seconds", file=sys.stdout, flush=True)
    return supplier_id

if __name__ == "__main__":
    start_time = time.time()
    print("Main block started", file=sys.stdout, flush=True)
    if len(sys.argv) < 30:
        print("Usage: python reorder.py <stock_id> <restaurant_id> [mode]", file=sys.stdout, flush=True)
        sys.exit(1)
    
    stock_id = sys.argv[1]
    restaurant_id = sys.argv[2]
    mode = sys.argv[3] if len(sys.argv) > 3 else "reorder"
    print(f"Main: Processing stockId: {stock_id}, restaurantId: {restaurant_id}, mode: {mode}", file=sys.stdout, flush=True)

    if mode == "consumption":
        result = get_consumption_data(stock_id, restaurant_id).to_dict(orient="records")
        print(json.dumps(result, default=str), file=sys.stdout, flush=True)
    elif mode == "forecast":
        consumption_df = get_consumption_data(stock_id, restaurant_id)
        result = forecast_demand(consumption_df).to_dict(orient="records")
        print(json.dumps(result, default=str), file=sys.stdout, flush=True)
    else:  # mode == "reorder"
        result = calculate_reorder(stock_id, restaurant_id)
        if "supplier_id" in result:
            result["supplier_id"] = optimize_supplier(stock_id) or result["supplier_id"]
        print(json.dumps(result, default=str), file=sys.stdout, flush=True)

    print(f"Total execution time: {time.time() - start_time:.2f} seconds", file=sys.stdout, flush=True)
    print("Script completed successfully", file=sys.stdout, flush=True)
    sys.stdout.flush()