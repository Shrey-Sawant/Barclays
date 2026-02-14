from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split

def create_target(df):
    """
    Creates the 'will_miss_emi' target based on stress signal thresholds.
    """
    df["will_miss_emi"] = (
        (df["income_to_emi_ratio"] < 3) |
        (df["failed_auto_debits"] >= 2) |
        (df["salary_delay_days"] > 5) |
        (df["risk_momentum"] > 15)
    ).astype(int)
    return df

def train_model(df):
    """
    Trains an XGBoost model on the engineered features.
    """
    X = df.drop("will_miss_emi", axis=1)
    y = df["will_miss_emi"]

    X_train, _, y_train, _ = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = XGBClassifier(
        n_estimators=200,
        max_depth=4,
        learning_rate=0.05,
        eval_metric="logloss"
    )

    model.fit(X_train, y_train)
    return model
