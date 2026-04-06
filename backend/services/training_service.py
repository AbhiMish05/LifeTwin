GOAL_ACTIONS = {
    "fat_loss": "Do 30 min cardio",
    "productivity": "Focus on deep work for 2 hours",
    "relaxation": "Avoid screens and relax",
}


def generate_plan(state):
    plan = []

    if state.energy < 0.4:
        plan.append("Take a 20 min nap")

    if state.stress > 0.6:
        plan.append("Do 10 min meditation")

    if state.activity_level < 0.4:
        plan.append("Go for a 20 min walk")

    goal_action = GOAL_ACTIONS.get(state.goal)
    if goal_action:
        plan.append(goal_action)

    return plan