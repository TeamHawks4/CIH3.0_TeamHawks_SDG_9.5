# ml_service.py
import pandas as pd
import numpy as np
from model_loader import pipeline, explainer

CLASSES = ["Low", "Medium", "High"]

def predict_growth(data):
    # Convert input dict to DataFrame
    df = pd.DataFrame([data])
    # Standardize columns to match training data (snake_case)
    #df.columns = [col.replace(' ', '_').lower() for col in df.columns]
    
    # Extract preprocessor and model from pipeline
    # Assuming pipeline steps: [('preprocessor', ...), ('classifier', ...)]
    preprocessor = pipeline.named_steps['preprocessor']
    model = pipeline.named_steps['classifier']
    
    # Preprocess data
    X_transformed = preprocessor.transform(df)
    
    # Predict Class
    pred_idx = model.predict(X_transformed)[0]
    growth_class = CLASSES[pred_idx] if pred_idx < len(CLASSES) else "Unknown"
    
    # Compute SHAP values
    # For classification, shap_values is a list of arrays (one for each class)
    shap_values = explainer.shap_values(X_transformed)
    
    # Get SHAP values for the predicted class
    # Handle different return types from SHAP (list of arrays vs array)
    if isinstance(shap_values, list):
        class_shap_values = shap_values[pred_idx]
    elif len(np.array(shap_values).shape) == 3:
        class_shap_values = shap_values[:, :, pred_idx]
    else:
        class_shap_values = shap_values

    # Ensure it is a 1D array for the single sample
    class_shap_values = np.array(class_shap_values).flatten()
    
    # Get feature names from the preprocessor step in the pipeline
    try:
        feature_names = preprocessor.get_feature_names_out()
    except Exception:
        feature_names = [f"feature_{i}" for i in range(X_transformed.shape[1])]
    shap_summary = sorted(zip(feature_names, class_shap_values), key=lambda x: abs(x[1]), reverse=True)[:5]

    return growth_class, shap_summary
