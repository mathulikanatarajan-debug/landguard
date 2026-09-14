from fastapi import APIRouter

router = APIRouter()

@router.get("/chatbot")
async def get_chatbot_context():
    return {
        "location": "Gangtok",
        "risk_level": "HIGH",
        "forecast_window": "6–12 hours",
        "suggested_answers": [
            "Current Risk",
            "Next 6 Hours",
            "Why is Risk High?",
            "Safety Instructions",
            "Evacuation Help",
            "Emergency Preparation",
        ],
        "response": "The selected area is under elevated rainfall-driven landslide risk. Estimated landslide probability is highest during the next 6–12 hours. Follow official local guidance and avoid unstable slopes."
    }
