def score_state(state):
    return (
        state.energy * 0.35 +
        (1 - state.stress) * 0.30 +
        state.activity_level * 0.20 +
        (1 - state.sleep_debt) * 0.15
    )