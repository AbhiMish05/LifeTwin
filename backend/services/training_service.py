def generate_plan(state):
    if state.goal == "fat_loss":
        return [
            "30 min cardio",
            "10k steps daily",
            "Reduce sugar intake"
        ]

    elif state.goal == "productivity":
        return [
            "Deep work 2 hours",
            "20 min nap",
            "Limit screen time"
        ]

    elif state.goal == "relaxation":
        return [
            "Meditation 15 min",
            "Light walk",
            "Reduce workload"
        ]

    return []