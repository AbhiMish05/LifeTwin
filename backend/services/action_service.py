BASE_ACTIONS = (
    "go_to_gym",
    "take_nap",
    "meditate",
    "rest",
    "go_for_walk",
    "deep_work",
    "socialize",
)


def generate_actions(state):
    if getattr(state, "time_of_day", None) == "night":
        return [action for action in BASE_ACTIONS if action != "go_to_gym"]

    return list(BASE_ACTIONS)