from services.action_service import generate_actions
from services.simulation_service import simulate_action
from services.scoring_service import score_state

def evaluate_actions(state):
    actions = generate_actions(state)

    results = []

    for action in actions:
        predicted_state = simulate_action(state, action)
        score = score_state(predicted_state)

        results.append({
            "action": action,
            "score": score,
            "predicted_state": predicted_state.to_dict()
        })

    results.sort(key=lambda x: x["score"], reverse=True)

    return results