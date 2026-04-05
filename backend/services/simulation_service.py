import copy

def simulate_action(state, action):
    new_state = copy.deepcopy(state)

    if action == "go_to_gym":
        new_state.energy -= 0.2
        new_state.stress -= 0.3
        new_state.activity_level += 0.3

    elif action == "play_sport":
        new_state.energy -= 0.15
        new_state.stress -= 0.25
        new_state.activity_level += 0.25

    elif action == "take_nap":
        new_state.energy += 0.3
        new_state.sleep_debt -= 0.5

    elif action == "meditate":
        new_state.stress -= 0.4

    elif action == "rest":
        new_state.energy += 0.1
        new_state.stress -= 0.1

    # clamp values
    new_state.energy = max(0, min(1, new_state.energy))
    new_state.stress = max(0, min(1, new_state.stress))
    new_state.activity_level = max(0, min(1, new_state.activity_level))
    new_state.sleep_debt = max(0, new_state.sleep_debt)

    return new_state