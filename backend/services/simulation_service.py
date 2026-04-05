import copy

def simulate_action_over_time(state, action, steps=3):
    new_state = copy.deepcopy(state)

    for _ in range(steps):
        if action == "go_to_gym":
            new_state.energy -= 0.1
            new_state.stress -= 0.1
            new_state.activity_level += 0.1

        elif action == "take_nap":
            new_state.energy += 0.15
            new_state.sleep_debt -= 0.2

        elif action == "meditate":
            new_state.stress -= 0.15

        elif action == "rest":
            new_state.energy += 0.05
            new_state.stress -= 0.05

        # natural effects
        new_state.energy -= 0.02
        new_state.stress += 0.02

        # clamp
        new_state.energy = max(0, min(1, new_state.energy))
        new_state.stress = max(0, min(1, new_state.stress))
        new_state.activity_level = max(0, min(1, new_state.activity_level))
        new_state.sleep_debt = max(0, new_state.sleep_debt)

    return new_state