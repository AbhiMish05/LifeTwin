def generate_actions(state):
    actions = []

    if state.time_of_day == "night":
        return ["rest", "take_nap"]

    if state.energy > 0.6:
        actions.append("go_to_gym")

    if state.sleep_debt > 1:
        actions.append("take_nap")

    if state.stress > 0.5:
        actions.append("meditate")

    if state.energy < 0.4:
        actions.append("rest")

    return list(set(actions))