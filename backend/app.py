from flask import Flask, request, jsonify
from db import supabase
from ml_service import predict_growth
from blockchain import invest_on_chain
from werkzeug.security import generate_password_hash, check_password_hash
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import uuid
import datetime

app = Flask(__name__)

# ---------------- Health Check ----------------
@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "running", "message": "Backend is active and model is loaded."})

# ---------------- Authentication ----------------
@app.route("/auth/register", methods=["POST"])
def register():
    data = request.json
    user_id = str(uuid.uuid4())
    hashed_pw = generate_password_hash(data["password"])
    
    user_data = {
        "user_id": user_id,
        "username": data["username"],
        "password_hash": hashed_pw,
        "role": data["role"],
        "created_at": datetime.datetime.now().isoformat()
    }
    supabase.table("users").insert(user_data).execute()
    return jsonify({"message": "User registered", "user_id": user_id, "role": data["role"]})

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.json
    user = supabase.table("users").select("*").eq("username", data["username"]).execute().data
    if not user or not check_password_hash(user[0]["password_hash"], data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"message": "Login successful", "user_id": user[0]["user_id"], "role": user[0]["role"]})

# ---------------- Achiever Onboarding ----------------
@app.route("/startup/onboard", methods=["POST"])

def onboard_startup():
    
    # 🔹 Assume frontend sends EXACT feature names used in model
    data = request.json
    
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id missing"}), 400

    # 🔹 Prepare ML input (only model-used columns)
    ml_columns = [
        "Domain",
        "Startup_Stage",
        "Industry_Funder_Type",
        "Investment_Amount",
        "Valuation",
        "Number_of_Investors",
        "Year_Founded"
    ]

    ml_input = {col: data[col] for col in ml_columns if col in data}

    # 🔹 Predict growth class + SHAP
    growth_class, shap_summary = predict_growth(ml_input)

    startup_id = str(uuid.uuid4())
    data["User_ID"] = user_id 
    data["Growth_Class"] = growth_class

    # 🔹 Insert startup into DB (PascalCase schema)
        # Map PascalCase keys to lowercase DB columns
    startup_columns_mapping = {
        "Startup_ID": "startup_id",
        "User_ID": "user_id",
        "Startup_Idea": "startup_idea",
        "Domain": "domain",
        "Startup_Stage": "startup_stage",
        "Industry_Funder_Type": "industry_funder_type",
        "Project_Duration_Months": "project_duration_months",
        "SDG_Alignment": "sdg_alignment",
        "Investment_Amount": "investment_amount",
        "Valuation": "valuation",
        "Number_of_Investors": "number_of_investors",
        "Year_Founded": "year_founded",
        "Growth_Rate_Cent": "growth_rate_cent",
        "Country": "country",
        "Growth_Class": "growth_class",
        "Project_Status": "project_status",
        "Funding_Rounds": "funding_rounds"
    }

    db_data = {startup_columns_mapping[k]: data[k] for k in startup_columns_mapping if k in data}

    try:
        result = supabase.table("startups").insert(db_data).execute()
        startup_id = result.data[0]["startup_id"]  # DB-generated UUID
    except Exception as e:
        print(f"Database Error: {e}")
        return jsonify({"error": "Failed to save startup data"}), 500
    # 🔹 Save SHAP results (lowercase startup_id column)
    for feature_name, shap_val in shap_summary:
        supabase.table("shap_results").insert({
            "startup_id": startup_id,
            "feature": feature_name,
            "shap_value": float(shap_val)
        }).execute()

    return jsonify({
        "startup_id": startup_id,
        "growth_class": growth_class,
        "top_features": [f[0] for f in shap_summary]
    })



# ---------------- Investor Profile ----------------
@app.route("/investor/profile", methods=["POST"])
def create_investor_profile():
    data = request.json
    investor_id = data.get("user_id")
    if not investor_id:
        return jsonify({"error": "user_id is required"}), 400

    profile_data = {
        "investor_id": investor_id,
        "user_id": investor_id,
        "investor_name": data.get("investor_name", "Anonymous"),
        "preferred_domain": data.get("preferred_domain"),
        "min_valuation": data.get("min_valuation"),
        "max_valuation": data.get("max_valuation"),
        "min_growth_rate": data.get("min_growth_rate"),
    }
    
    # Use upsert to create a profile if it doesn't exist, or update it if it does.
    supabase.table("investors").upsert(profile_data, on_conflict="investor_id").execute()
    
    return jsonify({"message": "Profile created/updated", "investor_id": investor_id})

# ---------------- Investor Recommendations ----------------
@app.route("/investor/recommend", methods=["POST"])
def recommend():
    prefs = request.json
    startups = supabase.table("startups").select("*").execute().data

    # Step A: Rule-Based Filtering
    filtered = [
        s for s in startups
        if s["valuation"] >= prefs.get("min_valuation", 0)
        and s["valuation"] <= prefs.get("max_valuation", float('inf'))
        and s.get("growth_rate_cent", 0) >= prefs.get("min_growth_rate", 0)
        and (not prefs.get("domain") or s["domain"] == prefs.get("domain"))
    ]

    if not filtered:
        return jsonify([])

    # Step B: Similarity-Based Ranking (Cosine Similarity)
    # Vector: [1 - Normalized_Valuation, Normalized_Growth_Rate] to favor low valuation and high growth.
    max_val = max(s["valuation"] for s in filtered) or 1
    max_growth = max(s.get("growth_rate_cent", 0) for s in filtered) or 1

    # Investor's ideal vector represents a preference for lowest valuation and highest growth.
    investor_vec = np.array([[1, 1]])

    scored_startups = []
    for s in filtered:
        startup_vec = np.array([[
            1 - (s["valuation"] / max_val), # Invert valuation score
            s.get("growth_rate_cent", 0) / max_growth
        ]])
        
        similarity = cosine_similarity(investor_vec, startup_vec)[0][0]
        s["match_score"] = float(similarity)
        scored_startups.append(s)

    # Return Top 5
    top5 = sorted(scored_startups, key=lambda x: x["match_score"], reverse=True)[:5]

    return jsonify(top5)

# ---------------- Blockchain Investment ----------------
@app.route("/invest/trigger", methods=["POST"])
def trigger_investment():
    data = request.json

    # 🔹 Validate input
    startup_id = data.get("startup_id")
    investor_id = data.get("investor_id")

    if not startup_id or not investor_id:
        return jsonify({"error": "Missing startup_id or investor_id"}), 400

    # 🔹 Check if investor exists
    investor = supabase.table("investors").select("*").eq("investor_id", investor_id).execute()
    if not investor.data or len(investor.data) == 0:
        return jsonify({"error": "Investor profile not found"}), 404

    # 🔹 Mock blockchain interaction
    tx_hash = invest_on_chain(startup_id, investor_id)
    if not tx_hash:
        return jsonify({"error": "Blockchain transaction failed"}), 500

    # 🔹 Prepare DB record
    investment_record = {
        "investment_id": str(uuid.uuid4()),
        "investor_id": investor_id,
        "startup_id": startup_id,
        "tx_hash": tx_hash,
        "status": "Success"
    }

    # 🔹 Insert into DB safely
    try:
        supabase.table("investments").insert(investment_record).execute()
    except Exception as e:
        return jsonify({"error": f"Database insertion failed: {e}"}), 500

    return jsonify({
        "message": "Investment recorded successfully",
        "tx_hash": tx_hash
    })
    

if __name__ == "__main__":
    app.run(debug=True)
