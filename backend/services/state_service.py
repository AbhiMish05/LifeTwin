from models.state import UserState

def update_state(state: UserState, data: dict):
    sleep = data.get("sleep_hours", 7)
    steps = data.get("steps", 5000)
    screen = data.get("screen_time", 3)

    state.energy += (sleep - 7) * 0.05
    state.stress += screen * 0.02
    state.activity_level += steps / 10000

    # clamp values (important!)
    state.energy = max(0, min(1, state.energy))
    state.stress = max(0, min(1, state.stress))
    state.activity_level = max(0, min(1, state.activity_level))

    return state