def score_state(state):
    energy = state.energy
    stress = state.stress
    activity_level = state.activity_level

    # BASE HEALTH
    base = (
        energy * 0.4 +
        (1 - stress) * 0.4 +
        activity_level * 0.2
    )

    # 🎯 GOAL BASED DIFFERENTIATION
    if state.goal == "fat_loss":
        return base + activity_level * 0.6

    elif state.goal == "productivity":
        return base + energy * 0.5 - stress * 0.3

    elif state.goal == "relaxation":
        return base + (1 - stress) * 0.6

    return base