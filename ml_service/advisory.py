def generate_advisory(row):
    """Generates personalized financial advice based on stress signals in features."""
    messages = []

    if row.get("discretionary_ratio", 0) > 0.4:
        messages.append(
            "Your discretionary expenses exceed 40% of income. "
            "Reducing entertainment spend by ₹3,000 can improve EMI stability."
        )

    if row.get("savings_decline_pct", 0) > 20:
        messages.append(
            "Your savings are declining rapidly. Maintaining a buffer "
            "of 3 EMI cycles is recommended."
        )

    if not messages:
        messages.append("Your financial health looks stable. Keep up the good habits!")

    return " ".join(messages)
