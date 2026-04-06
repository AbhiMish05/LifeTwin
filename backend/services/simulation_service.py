from models.state import UserState

ACTION_DELTAS = {
    "go_to_gym": (-0.1, -0.1, 0.1, 0.0),
    "take_nap": (0.15, 0.0, 0.0, -0.2),
    "meditate": (0.0, -0.15, 0.0, 0.0),
    "rest": (0.05, -0.05, 0.0, 0.0),
    "go_for_walk": (0.05, -0.05, 0.1, 0.0),
    "deep_work": (-0.1, 0.05, 0.0, 0.0),
    "socialize": (0.05, -0.1, 0.0, 0.0),
}


def _clamp01(value):
    return max(0, min(1, value))

def _copy_state(state):
    new_state = UserState()
    new_state.energy = state.energy
    new_state.stress = state.stress
    new_state.sleep_debt = state.sleep_debt
    new_state.activity_level = state.activity_level
    new_state.time_of_day = getattr(state, "time_of_day", new_state.time_of_day)
    new_state.goal = getattr(state, "goal", new_state.goal)
    new_state.history = list(getattr(state, "history", []))
    return new_state


def simulate_action_over_time(state, action, steps=3):
    new_state = _copy_state(state)
    energy_delta, stress_delta, activity_delta, sleep_delta = ACTION_DELTAS.get(action, (0.0, 0.0, 0.0, 0.0))

    for _ in range(steps):
        new_state.energy += energy_delta
        new_state.stress += stress_delta
        new_state.activity_level += activity_delta
        new_state.sleep_debt += sleep_delta

        # natural effects
        new_state.energy -= 0.02
        new_state.stress += 0.02

        # clamp
        new_state.energy = _clamp01(new_state.energy)
        new_state.stress = _clamp01(new_state.stress)
        new_state.activity_level = _clamp01(new_state.activity_level)
        new_state.sleep_debt = max(0, new_state.sleep_debt)

    return new_state