import os
from flask import Flask, jsonify
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
from flask_cors import CORS

try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False

import pandas as pd

from data_loader import load_customers
from feature_engineering import build_features
from model import create_target, train_model
from health_score import calculate_health_score
from advisory import generate_advisory
from offer_engine import select_best_offer
from alert_engine import should_alert, get_grok_insights

app = Flask(__name__)
CORS(app)

# Load and prepare data
base_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(base_dir, "..", "data", "early_financial_stress_mock_data_500_customers.json")

def initialize_model():
    if os.path.exists(data_path):
        customers = load_customers(data_path)
        df = build_features(customers)
        df = create_target(df)
        model = train_model(df)
        
        if HAS_SHAP and model is not None:
            explainer = shap.TreeExplainer(model)
        else:
            explainer = None
        return customers, df, model, explainer
    return None, None, None, None

customers, df, model, explainer = initialize_model()

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ML Service is running",
        "data_loaded": customers is not None,
        "model_trained": model is not None
    })

@app.route("/predict", methods=["GET"])
def predict():
    if model is None:
        return jsonify({"error": "Model not trained. Run generator first."}), 500

    X = df.drop("will_miss_emi", axis=1)
    probs = model.predict_proba(X)[:, 1]
    
    if HAS_SHAP and explainer is not None:
        shap_values = explainer.shap_values(X)
    else:
        shap_values = None
        
    feature_names = X.columns.tolist()
    results = []

    # Sort indices by risk score to identify the highest risk customers for AI insights
    risk_indices = sorted(range(len(probs)), key=lambda i: probs[i], reverse=True)
    ai_insight_targets = set(risk_indices[:3]) # Limit to top 3 for performance

    for i, row in X.iterrows():
        risk_score = int(probs[i] * 100)
        health = calculate_health_score(row)
        offer = select_best_offer(probs[i], customers[i]["emi_details"]["emi_amount"])
        advisory = generate_advisory(row)
        alert = should_alert({**row, "risk_score": risk_score})
        
        top_factors = []
        if shap_values is not None:
            if isinstance(shap_values, list):
                vals = shap_values[1][i]
            else:
                vals = shap_values[i]
            top_factors = sorted(zip(feature_names, vals), key=lambda x: abs(x[1]), reverse=True)[:3]

        top_factors_list = [{"feature": f, "impact": float(v)} for f, v in top_factors]
        
        # Call Grok for insights only for top 3 high-risk customers or if explicitly triggered
        # This prevents the route from hanging due to 500 sequential API calls
        ai_insight = None
        if i in ai_insight_targets:
            ai_insight = get_grok_insights({**row, "risk_score": risk_score}, top_factors_list)

        results.append({
            "customer_id": customers[i]["customer_id"],
            "risk_score": risk_score,
            "health_score": float(health) if hasattr(health, 'item') else health,
            "alert": bool(alert),
            "recommended_offer": offer,
            "advisory": advisory,
            "ai_insight": ai_insight,
            "top_factors": top_factors_list
        })

    return jsonify(results)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
