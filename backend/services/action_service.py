def generate_actions(state):
    actions = []

    # context-aware actions (not random)
    if state.energy > 0.6:
        actions.append("go_to_gym")
        actions.append("play_sport")

    if state.sleep_debt > 1:
        actions.append("take_nap")

    if state.stress > 0.6:
        actions.append("meditate")

    actions.append("rest")

    return actions