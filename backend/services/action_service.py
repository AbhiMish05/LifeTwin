def generate_actions(state):
    # ✅ Always allow all actions
    actions = ["go_to_gym", "take_nap", "meditate", "rest"]

    # Optional filtering (soft, not hard return)
    if state.time_of_day == "night":
        actions.remove("go_to_gym")

    return actions