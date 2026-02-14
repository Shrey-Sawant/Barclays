import json
import random
import os
from datetime import datetime, timedelta

def generate_mock_data(num_customers=500):
    customers = []
    
    for i in range(1, num_customers + 1):
        cust_id = f"CUST{1000 + i}"
        income = random.randint(30000, 150000)
        emi = int(income * random.uniform(0.1, 0.4))
        balance = random.randint(20000, 200000)
        
        # Behavioral metrics
        salary_delay = random.choice([0, 0, 0, 1, 2, 5, 7, 10])
        failed_debits = random.randint(0, 3)
        disc_ratio = round(random.uniform(0.2, 0.7), 2)
        savings_decline = random.randint(0, 40)
        
        customer = {
            "customer_id": cust_id,
            "profile": {
                "name": f"Customer_{i}",
                "age": random.randint(22, 60),
                "employment_type": random.choice(["salaried", "self_employed"]),
                "monthly_income": income,
                "city_tier": random.choice(["Tier-1", "Tier-2", "Tier-3"]),
                "customer_since": (datetime.now() - timedelta(days=random.randint(365, 3650))).strftime("%Y-%m-%d")
            },
            "accounts": [
                {
                    "account_id": f"SAV{i}",
                    "type": "savings",
                    "current_balance": balance,
                    "average_monthly_balance": int(balance * random.uniform(0.8, 1.2))
                }
            ],
            "transactions": [
                {
                    "transaction_id": f"TXN{i}01",
                    "date": "2026-01-01",
                    "amount": income,
                    "type": "credit",
                    "category": "salary_credit",
                    "mode": "bank_transfer"
                },
                {
                    "transaction_id": f"TXN{i}02",
                    "date": "2026-01-05",
                    "amount": emi,
                    "type": "debit",
                    "category": "emi_payment",
                    "mode": "auto_debit"
                }
            ],
            "emi_details": {
                "loan_type": random.choice(["personal_loan", "home_loan", "auto_loan"]),
                "emi_amount": emi,
                "emi_due_day": random.randint(1, 28),
                "last_emi_paid_on": (datetime.now() - timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d"),
                "missed_emi_count_last_6m": random.randint(0, 4)
            },
            "behavioral_metrics": {
                "salary_delay_days": salary_delay,
                "savings_decline_pct": savings_decline,
                "discretionary_ratio": disc_ratio,
                "atm_spike_pct": random.randint(0, 50),
                "failed_auto_debits": failed_debits,
                "utility_payment_delay_days": random.randint(0, 15)
            },
            "risk_history": [
                {
                    "date": "2025-12-01",
                    "risk_score": random.randint(20, 90)
                },
                {
                    "date": "2026-01-01",
                    "risk_score": random.randint(20, 100)
                }
            ]
        }
        customers.append(customer)
        
    return customers

if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    mock_data = generate_mock_data(500)
    output_path = os.path.join("data", "early_financial_stress_mock_data_500_customers.json")
    
    with open(output_path, "w") as f:
        json.dump(mock_data, f, indent=2)
        
    print(f"Successfully generated {len(mock_data)} customers in {output_path}")
