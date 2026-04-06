from services.action_service import generate_actions
from services.simulation_service import simulate_action_over_time
from services.scoring_service import score_state

def _build_profile_extra(profile=None):
    if not profile:
        return ""

    fragments = []

    if profile.get("diet") == "vegetarian":
        fragments.append("Vegetarian diet considered.")

    age = profile.get("age", 20)
    try:
        age = int(age)
    except (TypeError, ValueError):
        age = 20

    if age > 40:
        fragments.append("Lower intensity preferred due to age.")

    routine = str(profile.get("routine", "")).lower()
    if "gym" in routine:
        fragments.append("Existing active routine detected.")

    return " ".join(fragments)


def generate_reason(old, new, action, profile_extra=""):
    extra = f"{profile_extra}\n" if profile_extra else ""

    return f"""
Action: {action}

Energy: {old.energy:.2f} → {new.energy:.2f}
Stress: {old.stress:.2f} → {new.stress:.2f}

{extra}
"""


def evaluate_actions(current_state, profile=None):
    actions = generate_actions(current_state)
    results = []
    recent_actions = set(current_state.history[-2:])
    profile_extra = _build_profile_extra(profile)

    for action in actions:
        predicted = simulate_action_over_time(current_state, action)
        score = score_state(predicted)

        # memory penalty
        if action in recent_actions:
            score -= 0.1

        results.append({
            "action": action,
            "score": score,
            "predicted_state": predicted.to_dict(),
            "reason": generate_reason(current_state, predicted, action, profile_extra)
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results