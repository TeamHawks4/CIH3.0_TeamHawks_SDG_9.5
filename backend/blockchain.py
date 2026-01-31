# blockchain.py
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

def invest_on_chain(startup_id, investor_id):
    """
    Mock blockchain transaction
    """
    try:
        print(f"⛓️ Blockchain call | startup={startup_id}, investor={investor_id}")
        return "0x" + "a" * 64
    except Exception as e:
        print("Blockchain error:", e)
        return None
