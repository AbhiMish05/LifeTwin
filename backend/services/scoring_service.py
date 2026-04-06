def score_state(state):
    score = (
        state.energy * 0.5 +
        (1 - state.stress) * 0.5
    )

    if state.goal == "fat_loss":
        score += state.activity_level * 0.5

    elif state.goal == "productivity":
        score += state.energy * 0.3

    elif state.goal == "relaxation":
        score += (1 - state.stress) * 0.4

    # penalties
    if state.energy < 0.3:
        score -= 0.4

    if state.stress > 0.8:
        score -= 0.4

    return score