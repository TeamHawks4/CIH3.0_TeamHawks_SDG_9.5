# Loads saved models.
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "ml_pipeline.pkl")
EXPLAINER_PATH = os.path.join(BASE_DIR, "shap_explainer.pkl")

if not os.path.exists(MODEL_PATH) or not os.path.exists(EXPLAINER_PATH):
    raise FileNotFoundError(
        f"Model artifacts not found at {BASE_DIR}.\n"
        "Please run 'python train_model.py' to generate the model and explainer files."
    )

pipeline = joblib.load(MODEL_PATH)
explainer = joblib.load(EXPLAINER_PATH)
