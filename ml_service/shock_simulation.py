import pandas as pd
import numpy as np
import copy
import random

def apply_financial_shock(customers, scenario="standard", intensity=1.0):
    """
    Simulates realistic financial shocks on a list of customer records.
    
    Scenarios:
    - 'inflation': Increases discretionary spend and depletes savings.
    - 'recession': Delays salaries and increases failed auto-debits.
    - 'interest_rate_spike': Increases EMI amounts.
    - 'liquidity_crisis': One-time emergency expenses hitting balance.
    """
    simulated_customers = copy.deepcopy(customers)
    
    for c in simulated_customers:
        bm = c["behavioral_metrics"]
        profile = c["profile"]
        acc = c["accounts"][0]
        emi = c["emi_details"]

        if scenario == "inflation" or scenario == "standard":
            # Inflation increases the portion of income spent on essentials/discretionary
            inflation_factor = 0.15 * intensity
            bm["discretionary_ratio"] = min(bm["discretionary_ratio"] * (1 + inflation_factor), 0.95)
            # Higher spending leads to faster savings decline
            bm["savings_decline_pct"] += int(10 * intensity)
            # Balance hit: Subtract a portion of income due to rising costs
            acc["current_balance"] -= int(profile["monthly_income"] * 0.05 * intensity)

        if scenario == "recession":
            # Delays become more severe
            bm["salary_delay_days"] += int(3 * intensity)
            bm["utility_payment_delay_days"] += int(4 * intensity)
            # Probability of failed auto-debits increases
            if random.random() < (0.3 * intensity):
                bm["failed_auto_debits"] += 1
            # Income might be cut
            profile["monthly_income"] *= (1 - (0.05 * intensity))

        if scenario == "interest_rate_spike":
            # Floating rate EMIs increase
            hike = 1.10 * intensity
            emi["emi_amount"] = int(emi["emi_amount"] * hike)

        if scenario == "liquidity_crisis":
            # Random emergency expense (Medical/Home repair)
            emergency_cost = int(profile["monthly_income"] * 0.5 * intensity)
            acc["current_balance"] -= emergency_cost
            bm["savings_decline_pct"] = 100 # Mark as total depletion

        # Final Safety Check: Balance cannot be negative for simulation metrics
        acc["current_balance"] = max(acc["current_balance"], 0)

    return simulated_customers

def apply_shock(df, salary_delay=0, inflation=0):
    """
    Legacy support for dataframe-based shocks (used if running on feature DF directly).
    """
    df_sim = df.copy()
    if "salary_delay_days" in df_sim.columns:
        df_sim["salary_delay_days"] += salary_delay
    
    if "discretionary_ratio" in df_sim.columns:
        df_sim["discretionary_ratio"] *= (1 + inflation)
        # Realism: Increased spending reduces 'savings_to_emi_ratio'
        if "savings_to_emi_ratio" in df_sim.columns:
            df_sim["savings_to_emi_ratio"] *= (1 - (inflation * 0.5))
            
    return df_sim