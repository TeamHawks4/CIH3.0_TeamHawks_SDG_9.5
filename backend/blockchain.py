# blockchain.py
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

def invest_on_chain(startup_id, investor_id):
    # In a real app, we would map investor_id to a wallet address
    # For this prototype, we assume a default account or mock the interaction
    try:
        # Mocking the contract call for the prototype if contract isn't deployed
        # tx = contract.functions.invest(startup_id, investor_id).transact({'from': w3.eth.accounts[0]})
        # return tx.hex()
        return "0x" + "a" * 64 # Mock hash
    except Exception as e:
        return "0x0000000000000000000000000000000000000000"
