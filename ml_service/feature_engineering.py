import pandas as pd

def build_features(customers):
    """
    Extracts features from the nested customer JSON structure.
    """
    rows = []

    for c in customers:
        profile = c.get("profile", {})
        accounts = c.get("accounts", [{}])
        emi_details = c.get("emi_details", {})
        bm = c.get("behavioral_metrics", {})
        rh = c.get("risk_history", [{}, {}])

        # Safety checks for ratios
        income = profile.get("monthly_income", 1)
        emi = emi_details.get("emi_amount", 1)  # Default to 1 to avoid div by zero
        
        # Safe access to account balance
        savings = 0
        if accounts and len(accounts) > 0:
            savings = accounts[0].get("current_balance", 0)
        
        income_emi_ratio = income / emi if emi > 0 else 100
        savings_emi_ratio = savings / emi if emi > 0 else 100
        
        # Risk momentum
        risk_mom = 0
        if isinstance(rh, list) and len(rh) >= 2:
            last_score = rh[-1].get("risk_score", 0) if isinstance(rh[-1], dict) else 0
            prev_score = rh[-2].get("risk_score", 0) if isinstance(rh[-2], dict) else 0
            risk_mom = last_score - prev_score

        row = {
            "income_to_emi_ratio": income_emi_ratio,
            "savings_to_emi_ratio": savings_emi_ratio,
            "salary_delay_days": bm.get("salary_delay_days", 0),
            "savings_decline_pct": bm.get("savings_decline_pct", 0),
            "discretionary_ratio": bm.get("discretionary_ratio", 0),
            "atm_spike_pct": bm.get("atm_spike_pct", 0),
            "failed_auto_debits": bm.get("failed_auto_debits", 0),
            "utility_payment_delay_days": bm.get("utility_payment_delay_days", 0),
            "missed_emi_6m": emi_details.get("missed_emi_count_last_6m", 0),
            "risk_momentum": risk_mom
        }

        rows.append(row)

    return pd.DataFrame(rows)
