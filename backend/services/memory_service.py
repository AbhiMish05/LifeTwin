import json
from models.state import UserState

FILE = "memory.json"

def save_state(state):
    with open(FILE, "w") as f:
        json.dump(state.to_dict(), f)

def load_state():
    try:
        with open(FILE, "r") as f:
            data = json.load(f)
            state = UserState()

            state.energy = data["energy"]
            state.stress = data["stress"]
            state.sleep_debt = data["sleep_debt"]
            state.activity_level = data["activity_level"]
            state.history = data.get("history", [])
            state.goal = data.get("goal", "productivity")

            return state
    except:
        return UserState()