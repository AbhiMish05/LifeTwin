from services.action_service import generate_actions
from services.simulation_service import simulate_action_over_time
from services.scoring_service import score_state

def generate_reason(old, new, action):
    return f"""
Action: {action}

Energy: {old.energy:.2f} → {new.energy:.2f}
Stress: {old.stress:.2f} → {new.stress:.2f}

This action improves your overall balance.
"""
def evaluate_actions(state):
    actions = generate_actions(state)
    results = []

    for action in actions:
        predicted = simulate_action_over_time(state, action)
        score = score_state(predicted)

        # memory penalty
        if action in state.history[-2:]:
            score -= 0.1

        results.append({
            "action": action,
            "score": score,
            "predicted_state": predicted.to_dict(),
            "reason": generate_reason(state, predicted, action)
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results