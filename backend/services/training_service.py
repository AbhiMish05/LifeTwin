def generate_plan(state):
    plan = []

    if state.energy < 0.4:
        plan.append("Take a 20 min nap")

    if state.stress > 0.6:
        plan.append("Do 10 min meditation")

    if state.activity_level < 0.4:
        plan.append("Go for a 20 min walk")

    if state.goal == "fat_loss":
        plan.append("Do 30 min cardio")

    if state.goal == "productivity":
        plan.append("Focus on deep work for 2 hours")

    if state.goal == "relaxation":
        plan.append("Avoid screens and relax")

    return plan