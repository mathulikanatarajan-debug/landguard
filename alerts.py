from fastapi import APIRouter

router = APIRouter()

@router.get("/alerts")
async def get_alerts():
    return {
        "critical": True,
        "location": "Gangtok, Sikkim",
        "probability": 82,
        "risk_level": "CRITICAL",
        "peak_window": "6–12 hours",
        "recommended_action": "Follow official local-authority guidance and move to a safer location if instructed.",
        "status": "LIVE",
    }
