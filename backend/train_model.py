import pandas as pd
import numpy as np
import os
import joblib
import shap
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# Define paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Assuming ready_data.csv is in the model folder parallel to backend
DATA_PATH = os.path.join(BASE_DIR, "../model/ready_data.csv") 
MODEL_PATH = os.path.join(BASE_DIR, "ml_pipeline.pkl")
EXPLAINER_PATH = os.path.join(BASE_DIR, "shap_explainer.pkl")

def train_and_save():
    # Clean up old artifacts to ensure fresh training
    if os.path.exists(MODEL_PATH):
        os.remove(MODEL_PATH)
    if os.path.exists(EXPLAINER_PATH):
        os.remove(EXPLAINER_PATH)

    print(f"Loading data from {DATA_PATH}...")
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Data file not found at {DATA_PATH}")

    data = pd.read_csv(DATA_PATH)
    # Standardize column names to snake_case
    # data.columns = [col.replace(' ', '_').lower() for col in data.columns]

    # 1. Feature Selection
    numeric_features = ['investment_amount', 'valuation', 'number_of_investors', 'year_founded']
    categorical_features = ['domain', 'startup_stage', 'industry_funder_type']

    # 2. Target Engineering: Create Growth Class (Low, Medium, High)
    # Using quantiles to split into 3 balanced classes: 0 (Low), 1 (Medium), 2 (High)
    data['growth_rate_cent'] = pd.to_numeric(data['growth_rate_cent'], errors='coerce')
    data.dropna(subset=['growth_rate_cent'], inplace=True)
    data['growth_class_label'] = pd.qcut(data['growth_rate_cent'], q=3, labels=[0, 1, 2])
    
    X = data[numeric_features + categorical_features]
    y = data['growth_class_label']

    # 3. Build Preprocessing Pipeline
    # StandardScaler for numeric, OneHotEncoder for categorical
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
        ]
    )

    # 4. Full Pipeline with Classifier
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])

    print("Training model...")
    pipeline.fit(X, y)
    print("Model trained.")

    # 5. Generate SHAP Explainer
    print("Generating SHAP explainer...")
    model = pipeline.named_steps['classifier']
    preprocessor_step = pipeline.named_steps['preprocessor']
    X_transformed = preprocessor_step.transform(X)
    explainer = shap.TreeExplainer(model)

    # 6. Save Artifacts
    print(f"Saving artifacts to {BASE_DIR}...")
    joblib.dump(pipeline, MODEL_PATH)
    joblib.dump(explainer, EXPLAINER_PATH)
    print("Done.")

if __name__ == "__main__":
    train_and_save()