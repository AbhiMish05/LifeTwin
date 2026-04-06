import copy
import time

from models.state import UserState
from services.action_service import generate_actions
from services.decision_service import evaluate_actions
from services.scoring_service import score_state
from services.simulation_service import simulate_action_over_time


def old_generate_reason(old, new, action, profile=None):
    extra = ""

    if profile:
        if profile.get("diet") == "vegetarian":
            extra += "Vegetarian diet considered. "

        if int(profile.get("age", 20)) > 40:
            extra += "Lower intensity preferred due to age. "

        if "gym" in profile.get("routine", "").lower():
            extra += "Existing active routine detected. "

    return (
        f"Action: {action}\n"
        f"Energy: {old.energy:.2f} -> {new.energy:.2f}\n"
        f"Stress: {old.stress:.2f} -> {new.stress:.2f}\n"
        f"{extra}"
    )


def old_simulate_action_over_time(state, action, steps=3):
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

        elif action == "go_for_walk":
            new_state.energy += 0.05
            new_state.stress -= 0.05
            new_state.activity_level += 0.1

        elif action == "deep_work":
            new_state.energy -= 0.1
            new_state.stress += 0.05

        elif action == "socialize":
            new_state.stress -= 0.1
            new_state.energy += 0.05

        new_state.energy -= 0.02
        new_state.stress += 0.02

        new_state.energy = max(0, min(1, new_state.energy))
        new_state.stress = max(0, min(1, new_state.stress))
        new_state.activity_level = max(0, min(1, new_state.activity_level))
        new_state.sleep_debt = max(0, new_state.sleep_debt)

    return new_state


def old_evaluate_actions(current_state, profile=None):
    actions = generate_actions(current_state)
    results = []

    for action in actions:
        _ = old_simulate_action_over_time(current_state, action)
        predicted = old_simulate_action_over_time(current_state, action)
        score = score_state(predicted)

        if action in current_state.history[-2:]:
            score -= 0.1

        results.append(
            {
                "action": action,
                "score": score,
                "predicted_state": predicted.to_dict(),
                "reason": old_generate_reason(current_state, predicted, action, profile),
            }
        )

    results.sort(key=lambda x: x["score"], reverse=True)
    return results


def make_state():
    state = UserState()
    state.energy = 0.58
    state.stress = 0.62
    state.sleep_debt = 1.1
    state.activity_level = 0.33
    state.time_of_day = "afternoon"
    state.goal = "productivity"
    state.history = ["rest", "meditate", "go_for_walk", "deep_work"]
    return state


def bench(fn, iterations, state, profile):
    start = time.perf_counter()
    for _ in range(iterations):
        fn(state, profile)
    return time.perf_counter() - start


def main():
    iterations = 3000
    profile = {
        "diet": "vegetarian",
        "age": "45",
        "routine": "gym 3x per week",
    }

    state_old = make_state()
    state_new = make_state()

    # Warm-up
    old_evaluate_actions(state_old, profile)
    evaluate_actions(state_new, profile)

    old_time = bench(old_evaluate_actions, iterations, state_old, profile)
    new_time = bench(evaluate_actions, iterations, state_new, profile)

    old_ms = (old_time / iterations) * 1000
    new_ms = (new_time / iterations) * 1000
    speedup = old_time / new_time if new_time else float("inf")
    reduction = ((old_time - new_time) / old_time * 100) if old_time else 0.0

    print(f"Iterations: {iterations}")
    print(f"Old total: {old_time:.4f}s | {old_ms:.4f} ms/call")
    print(f"New total: {new_time:.4f}s | {new_ms:.4f} ms/call")
    print(f"Speedup: {speedup:.2f}x")
    print(f"Time reduction: {reduction:.2f}%")


if __name__ == "__main__":
    main()
