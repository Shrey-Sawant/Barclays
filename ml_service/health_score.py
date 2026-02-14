def calculate_health_score(row):
    """Calculates customer health score based on the engineered features."""
    score = 100

    if row.get("discretionary_ratio", 0) > 0.4:
        score -= 25
    if row.get("savings_decline_pct", 0) > 20:
        score -= 20
    if row.get("income_to_emi_ratio", 10) < 3:
        score -= 30
    if row.get("utility_payment_delay_days", 0) > 5:
        score -= 15

    return max(int(score), 0)
