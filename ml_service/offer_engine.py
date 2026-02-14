OFFERS = {
    "Soft Reminder": {"cost": 0, "reduction": 0.05},
    "Grace Period": {"cost": 500, "reduction": 0.15},
    "EMI Reduction": {"cost": 2000, "reduction": 0.30},
    "EMI Holiday": {"cost": 4000, "reduction": 0.45}
}

def select_best_offer(prob_default, emi):
    best_offer = None
    best_value = -1

    for name, o in OFFERS.items():
        ev = (prob_default * emi * o["reduction"]) - o["cost"]
        if ev > best_value:
            best_value = ev
            best_offer = name

    return best_offer
