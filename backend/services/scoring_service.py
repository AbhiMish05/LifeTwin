def score_state(state):
    score = 0

    if state.goal == "fat_loss":
        score += state.activity_level * 0.4
        score += (1 - state.stress) * 0.2
        score += state.energy * 0.2

    elif state.goal == "productivity":
        score += state.energy * 0.4
        score += (1 - state.stress) * 0.3

    elif state.goal == "relaxation":
        score += (1 - state.stress) * 0.5
        score += state.energy * 0.2

    # penalties
    if state.energy < 0.3:
        score -= 0.2
    if state.stress > 0.8:
        score -= 0.2

    return score