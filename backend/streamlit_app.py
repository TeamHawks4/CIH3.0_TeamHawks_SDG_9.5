import streamlit as st
import requests
import uuid

API = "http://127.0.0.1:5000"

# ================== UI / CSS ==================
st.set_page_config(
    page_title="Collaborative R&D Platform",
    page_icon="🚀",
    layout="wide"
)

st.markdown("""
<style>
html, body, [class*="css"] {
    font-family: 'Inter', sans-serif;
}

.main {
    background: linear-gradient(135deg, #020617, #020617);
    color: #e5e7eb;
}

h1 {
    text-align: center;
    font-weight: 800;
    background: linear-gradient(90deg, #22c55e, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.card {
    background: #020617;
    border-radius: 16px;
    padding: 1.4rem;
    margin-bottom: 1.2rem;
    border: 1px solid #1e293b;
    box-shadow: 0 12px 30px rgba(0,0,0,0.35);
}

section[data-testid="stSidebar"] {
    background: #020617;
    border-right: 1px solid #1e293b;
}

button {
    border-radius: 12px !important;
    font-weight: 600 !important;
}

input, select, textarea {
    background-color: #020617 !important;
    color: #e5e7eb !important;
    border-radius: 10px !important;
    border: 1px solid #1e293b !important;
}

div[data-testid="stProgress"] > div > div {
    background-image: linear-gradient(90deg, #22c55e, #3b82f6);
}

.fade-in {
    animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
""", unsafe_allow_html=True)

# ================== HEADER ==================
st.markdown("""
<h1>🚀 Collaborative R&D & Investment Intelligence Platform</h1>
<p style="text-align:center;color:#94a3b8;">
AI-driven growth prediction • Explainable insights • Secure investments
</p>
""", unsafe_allow_html=True)

# ================== SESSION STATE ==================
if "user_id" not in st.session_state:
    st.session_state["user_id"] = None
    st.session_state["role"] = None

# ================== AUTH ==================
if not st.session_state["user_id"]:
    tab1, tab2 = st.tabs(["🔐 Login", "📝 Register"])

    with tab1:
        st.markdown("<div class='card fade-in'>", unsafe_allow_html=True)
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        if st.button("Login"):
            res = requests.post(
                f"{API}/auth/login",
                json={"username": username, "password": password}
            )
            if res.status_code == 200:
                data = res.json()
                st.session_state["user_id"] = data["user_id"]
                st.session_state["role"] = data["role"]
                st.rerun()
            else:
                st.error("❌ Invalid credentials")
        st.markdown("</div>", unsafe_allow_html=True)

    with tab2:
        st.markdown("<div class='card fade-in'>", unsafe_allow_html=True)
        new_user = st.text_input("New Username")
        new_pass = st.text_input("New Password", type="password")
        role = st.selectbox("Role", ["achiever", "investor"])
        if st.button("Register"):
            res = requests.post(
                f"{API}/auth/register",
                json={"username": new_user, "password": new_pass, "role": role}
            )
            if res.status_code == 200:
                st.success("✅ Registered! Please login.")
            else:
                st.error("❌ Registration failed")
        st.markdown("</div>", unsafe_allow_html=True)

# ================== LOGGED IN ==================
else:
    st.sidebar.markdown("### 👤 Session")
    st.sidebar.success(f"Role: {st.session_state['role']}")
    if st.sidebar.button("🚪 Logout"):
        st.session_state["user_id"] = None
        st.session_state["role"] = None
        st.rerun()

    # ================== ACHIEVER ==================
    if st.session_state["role"] == "achiever":
        st.markdown("<div class='card fade-in'>", unsafe_allow_html=True)
        st.header("📌 Startup Onboarding")

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

            submitted = st.form_submit_button("🚀 Submit for AI Evaluation")

            if submitted:
                with st.spinner("Analyzing startup growth potential..."):
                    res = requests.post(f"{API}/startup/onboard", json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        st.success(f"✅ Growth Class: {data['growth_class']}")
                        st.info("🔍 Key Drivers")
                        st.write(data["top_features"])
                    else:
                        st.error("❌ Error submitting startup")

        st.markdown("</div>", unsafe_allow_html=True)

    # ================== INVESTOR ==================
    if st.session_state["role"] == "investor":
        st.header("💼 Investor Dashboard")

        with st.expander("🎯 Investment Preferences", expanded=True):
            pref_domain = st.selectbox("Preferred Domain", ["IoT", "Sustainability", "Smart Cities", "AgriTech", "Energy", "Blockchain", "AI", "Healthcare"])
            min_val = st.number_input("Min Valuation", value=0)
            max_val = st.number_input("Max Valuation", value=10_000_000)
            min_growth = st.number_input("Min Growth Rate (%)", value=5)

            if st.button("🔄 Update Profile"):
                requests.post(f"{API}/investor/profile", json={
                    "user_id": st.session_state["user_id"],
                    "preferred_domain": pref_domain,
                    "min_valuation": min_val,
                    "max_valuation": max_val,
                    "min_growth_rate": min_growth
                })
                st.success("Profile updated")

        if st.button("📊 Get AI Recommendations"):
            res = requests.post(f"{API}/investor/recommend", json={
                "domain": pref_domain,
                "min_valuation": min_val,
                "max_valuation": max_val,
                "min_growth_rate": min_growth
            })

            startups = res.json()

            for s in startups:
                st.markdown("<div class='card fade-in'>", unsafe_allow_html=True)
                c1, c2 = st.columns([3, 1])

                with c1:
                    st.subheader(f"🚀 {s['startup_idea']}")
                    st.caption(f"🌍 {s['domain']} • 🧪 {s['startup_stage']}")
                    st.markdown(f"**Growth Class:** `{s['growth_class']}`")
                    st.markdown(f"💰 Valuation: ${s['valuation']:,}")
                    st.markdown(f"📈 Growth Rate: {s['growth_rate_cent']}%")
                    st.progress(s.get("match_score", 0), text=f"Match Score: {s.get('match_score', 0):.2f}")

                with c2:
                    if st.button("💸 Invest Now", key=f"invest_{s['startup_id']}"):
                        with st.spinner("Processing blockchain investment..."):
                            inv_res = requests.post(
                                f"{API}/invest/trigger",
                                json={
                                    "investor_id": st.session_state["user_id"],
                                    "startup_id": s["startup_id"]
                                },
                                timeout=5
                            )

                            if inv_res.status_code == 200:
                                data = inv_res.json()
                                st.success(f"✅ Tx: {data['tx_hash'][:12]}...")
                            else:
                                st.error("❌ Investment failed")

                st.markdown("</div>", unsafe_allow_html=True)
                
st.markdown(
    """
    <style>
    /* FORCE chatbot above Streamlit sidebar */
    iframe, section, div {
        z-index: auto;
    }

    /* Chatbot container */
    #chatbot-container {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 320px;
        height: 420px;
        background: #020617;
        border-radius: 14px;
        border: 1px solid #1e293b;
        box-shadow: 0 20px 60px rgba(0,0,0,0.75);
        z-index: 2147483647 !important; /* MAX z-index */
        display: none;
        overflow: hidden;
        pointer-events: auto;
    }

    /* Toggle button */
    #chatbot-toggle {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #4f46e5, #6366f1);
        color: white;
        border-radius: 50%;
        border: none;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 10px 25px rgba(0,0,0,0.45);
        z-index: 2147483647 !important;
        transition: transform 0.2s ease;
    }

    #chatbot-toggle:hover {
        transform: scale(1.08);
    }
    </style>

    <button id="chatbot-toggle" title="AI Assistant">💬</button>

    <div id="chatbot-container">
        <script src="https://www.noupe.com/embed/019c11c941047ef5bdb7270f2ae4114dfd1d.js"></script>
    </div>

    <script>
    const toggleBtn = document.getElementById("chatbot-toggle");
    const chatbot = document.getElementById("chatbot-container");

    const isOpen = localStorage.getItem("chatbot_open") === "true";
    chatbot.style.display = isOpen ? "block" : "none";
    toggleBtn.innerHTML = isOpen ? "✖" : "💬";

    toggleBtn.addEventListener("click", () => {
        const open = chatbot.style.display === "none";
        chatbot.style.display = open ? "block" : "none";
        toggleBtn.innerHTML = open ? "✖" : "💬";
        localStorage.setItem("chatbot_open", open);
    });
    </script>
    """,
    unsafe_allow_html=True
)
