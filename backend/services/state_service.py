from datetime import datetime
from models.state import UserState

def get_time_of_day():
    hour = datetime.now().hour
    if hour < 12:
        return "morning"
    elif hour < 18:
        return "afternoon"
    else:
        return "night"

def update_state(state, data):
    sleep = data.get("sleep_hours", 7)
    steps = data.get("steps", 5000)
    screen = data.get("screen_time", 3)

    # ✅ RESET BASELINE (VERY IMPORTANT)
    state.energy = 0.5
    state.stress = 0.5
    state.activity_level = 0.3
    state.sleep_debt = 0

    # ✅ APPLY EFFECTS (NOT ACCUMULATIVE)
    state.energy += (sleep - 7) * 0.1
    state.stress += screen * 0.05
    state.activity_level += steps / 15000
    state.sleep_debt = max(0, 7 - sleep)

    state.goal = data.get("goal", "productivity")

    # 🔒 Clamp
    state.energy = max(0, min(1, state.energy))
    state.stress = max(0, min(1, state.stress))
    state.activity_level = max(0, min(1, state.activity_level))

    return state