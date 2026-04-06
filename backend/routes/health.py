from fastapi import APIRouter
from app.state_store import current_state
from services.state_service import update_state
from services.decision_service import evaluate_actions
from services.training_service import generate_plan
from services.memory_service import save_state

router = APIRouter()
user_profile = {}

@router.post("/profile")
def save_profile(data: dict):
    global user_profile
    user_profile = data
    return {"message": "Profile saved"}

@router.get("/plan")
def plan():
    return {
        "goal": current_state.goal,
        "plan": generate_plan(current_state)
    }

@router.get("/state")
def get_state():
    return current_state.to_dict()

@router.post("/update")
def update(data: dict):
    update_state(current_state, data)
    save_state(current_state)
    return current_state.to_dict()

@router.get("/recommend")
def recommend():
    results = evaluate_actions(current_state, user_profile)
    best = results[0]

    # save memory
    current_state.history.append(best["action"])
    save_state(current_state)

    return {
        "best_action": best,
        "all_options": results,
        "ai_explanation": f"Best action is {best['action']} based on predicted improvements."
    }

@router.get("/simulate/{action}")
def simulate(action: str):
    from services.simulation_service import simulate_action_over_time
    from services.scoring_service import score_state

    predicted = simulate_action_over_time(current_state, action)
    score = score_state(predicted)

    return {
        "action": action,
        "predicted_state": predicted.to_dict(),
        "score": score
    }