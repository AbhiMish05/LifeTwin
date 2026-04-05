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

def update_state(state: UserState, data: dict):
    sleep = data.get("sleep_hours", 7)
    steps = data.get("steps", 5000)
    screen = data.get("screen_time", 3)

    state.energy += (sleep - 7) * 0.05
    state.stress += screen * 0.02
    state.activity_level += steps / 10000
    state.sleep_debt += max(0, 7 - sleep)

    state.time_of_day = get_time_of_day()
    state.goal = data.get("goal", "productivity")

    # clamp
    state.energy = max(0, min(1, state.energy))
    state.stress = max(0, min(1, state.stress))
    state.activity_level = max(0, min(1, state.activity_level))

    return state