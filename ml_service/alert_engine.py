import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def should_alert(row):
    """Determines if a customer should be alerted of potential stress."""
    stress_signals = sum([
        row.get("salary_delay_days", 0) > 5,
        row.get("failed_auto_debits", 0) >= 2,
        row.get("discretionary_ratio", 0) > 0.45
    ])

    return (
        row.get("risk_score", 0) > 70 or
        row.get("risk_momentum", 0) > 15 or
        stress_signals >= 3
    )

def get_grok_insights(row, top_factors):
    """
    Uses xAI's Grok model to provide personalized suggestions based on risk factors.
    Identifies the most critical factor and provides a business-ready recommendation.
    """
    api_key = os.environ.get("XAI_API_KEY")
    if not api_key:
        return "AI Suggestions unavailable: XAI_API_KEY not set."

    client = OpenAI(
        api_key=api_key,
        base_url="https://api.x.ai/v1/chat/completions",
    )

    factors_desc = ", ".join([f"{f['feature']} (impact: {f['impact']:.2f})" for f in top_factors])
    
    prompt = f"""
    You are a professional financial risk analyst at Barclays. 
    Analyze the following customer metrics:
    - Risk Score: {row.get('risk_score', 'N/A')}/100
    - Key Factors from SHAP analysis: {factors_desc}
    - Recent behavioral alerts: Salary delay of {row.get('salary_delay_days', 0)} days, {row.get('failed_auto_debits', 0)} failed auto-debits.

    Task:
    1. Identify the single most critical factor affecting this customer's risk.
    2. Provide a specific, actionable suggestion for the customer to help them manage their finances and avoid missing their upcoming EMI.
    
    Keep the response under 100 words and maintain a professional tone.
    """

    try:
        response = client.chat.completions.create(
            model="grok-4-latest",
            messages=[
                {"role": "system", "content": "You are a professional financial advisor."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Grok Error: {str(e)}"
