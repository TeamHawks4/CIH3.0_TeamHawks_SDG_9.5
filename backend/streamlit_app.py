import streamlit as st
import requests
import uuid

API = "http://127.0.0.1:5000"

st.title("🚀 Collaborative R&D Platform")

# Session State for Auth
if "user_id" not in st.session_state:
    st.session_state["user_id"] = None
    st.session_state["role"] = None

# Authentication UI
if not st.session_state["user_id"]:
    tab1, tab2 = st.tabs(["Login", "Register"])
    
    with tab1:
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        if st.button("Login"):
            res = requests.post(f"{API}/auth/login", json={"username": username, "password": password})
            if res.status_code == 200:
                data = res.json()
                st.session_state["user_id"] = data["user_id"]
                st.session_state["role"] = data["role"]
                st.rerun()
            else:
                st.error("Invalid credentials")

    with tab2:
        new_user = st.text_input("New Username")
        new_pass = st.text_input("New Password", type="password")
        role = st.selectbox("Role", ["achiever", "investor"])
        if st.button("Register"):
            res = requests.post(f"{API}/auth/register", json={"username": new_user, "password": new_pass, "role": role})
            if res.status_code == 200:
                st.success("Registered! Please login.")

else:
    st.sidebar.write(f"Logged in as: {st.session_state['role']}")
    if st.sidebar.button("Logout"):
        st.session_state["user_id"] = None
        st.rerun()

    # ---------------- Achiever Workflow ----------------
    if st.session_state["role"] == "achiever":
        st.header("Startup Onboarding")
        with st.form("onboarding_form"):
            payload = {
                "user_id": st.session_state["user_id"],
                "Startup_Idea": st.text_input("Startup Idea"),
                "Domain": st.selectbox("Domain", ["IoT", "Sustainability", "Smart Cities", "AgriTech", "Energy", "Blockchain", "AI", "Healthcare"]),
                "Startup_Stage": st.selectbox("Stage", ["Idea", "Prototype", "MVP", "Early Revenue"]),
                "Industry_Funder_Type": st.selectbox("Funder Type", ["Angel Investor", "Corporate R&D", "Government Grant", "VC Firm"]),
                "Project_Duration_Months": st.number_input("Duration (Months)", min_value=1),
                "SDG_Alignment": st.text_input("SDG Alignment"),
                "Investment_Amount": st.number_input("Investment Amount ($)"),
                "Valuation": st.number_input("Valuation ($)"),
                "Number_of_Investors": st.number_input("Number of Investors", min_value=0),
                "Year_Founded": st.number_input("Year Founded", min_value=1990, max_value=2026),
                "Growth_Rate_Cent": st.number_input("Growth Rate (%)"),
                "Country": st.text_input("Country")
            }
            submitted = st.form_submit_button("Submit for Evaluation")
            
            if submitted:
                res = requests.post(f"{API}/startup/onboard", json=payload)
                if res.status_code == 200:
                    data = res.json()
                    st.success(f"Onboarded! Growth Class: {data['growth_class']}")
                    st.write("Key Drivers:", data['top_features'])
                else:
                    st.error("Error submitting data")

    # ---------------- Investor Workflow ----------------
    if st.session_state["role"] == "investor":
        st.header("Investor Dashboard")
        
        # Profile / Filter Settings
        with st.expander("Preferences", expanded=True):
            pref_domain = st.selectbox("Preferred Domain", ["IoT", "Sustainability", "Smart Cities", "AgriTech", "Energy", "Blockchain", "AI", "Healthcare"])
            min_val = st.number_input("Min Valuation", value=0)
            max_val = st.number_input("Max Valuation", value=10000000)
            min_growth = st.number_input("Min Growth Rate (%)", value=5)
            
            if st.button("Update Profile & Find"):
                # Create/Update profile (simplified)
                requests.post(f"{API}/investor/profile", json={
                    "user_id": st.session_state["user_id"],
                    "preferred_domain": pref_domain,
                    "min_valuation": min_val,
                    "max_valuation": max_val,
                    "min_growth_rate": min_growth
                })

        # Recommendations
        if st.button("Get Recommendations"):
            res = requests.post(f"{API}/investor/recommend", json={
                "domain": pref_domain if pref_domain else None,
                "min_valuation": min_val,
                "max_valuation": max_val,
                "min_growth_rate": min_growth
            })
            startups = res.json()
            
            for s in startups:
                with st.container(border=True):
                    c1, c2 = st.columns([3, 1])
                    with c1:
                        st.subheader(s["startup_idea"])
                        st.caption(f"Domain: {s['domain']} | Stage: {s['startup_stage']}")
                        st.write(f"**Growth Class:** {s['growth_class']}")
                        st.write(f"Valuation: ${s['valuation']:,} | Growth: {s['growth_rate_cent']}%")
                        st.progress(s.get("match_score", 0), text=f"Match Score: {s.get('match_score', 0):.2f}")
                    with c2:
                        if st.button("Invest", key=s["startup_id"]):
                            inv_res = requests.post(f"{API}/invest/trigger", json={
                                "investor_id": st.session_state["user_id"], # Using user_id as investor_id for simplicity
                                "startup_id": s["startup_id"]
                            })
                            st.success(f"Tx: {inv_res.json()['tx_hash'][:10]}...")
