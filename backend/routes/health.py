from fastapi import APIRouter
from app.state_store import current_state
from services.state_service import update_state
from services.decision_service import evaluate_actions

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.get("/state")
def get_state():
    return current_state.to_dict()

@router.post("/update")
def update(data: dict):
    updated = update_state(current_state, data)
    return updated.to_dict()


@router.get("/recommend")
def recommend():
    results = evaluate_actions(current_state)

    return {
        "best_action": results[0],
        "all_options": results
    }