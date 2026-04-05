from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_explanation(state, best_action, all_options):
    action = best_action["action"]

    return f"""
DECISION:
{action}

WHY THIS WORKS:
Your energy is {round(state.energy,2)} and stress is {round(state.stress,2)}.
This action optimizes your current condition and improves balance.

TRADE-OFF:
Short-term comfort vs long-term health gain.

QUICK TIP:
Stay consistent with small improvements.
"""