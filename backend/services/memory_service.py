import json
from models.state import UserState

FILE = "memory.json"


def save_state(state):
    with open(FILE, "w", encoding="utf-8") as f:
        json.dump(state.to_dict(), f, separators=(",", ":"))


def load_state():
    try:
        with open(FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            state = UserState()

            state.energy = data.get("energy", state.energy)
            state.stress = data.get("stress", state.stress)
            state.sleep_debt = data.get("sleep_debt", state.sleep_debt)
            state.activity_level = data.get("activity_level", state.activity_level)
            state.time_of_day = data.get("time_of_day", state.time_of_day)
            state.history = data.get("history", [])
            state.goal = data.get("goal", "productivity")

            return state
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        return UserState()