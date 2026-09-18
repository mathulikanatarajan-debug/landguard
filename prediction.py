from fastapi import APIRouter

router = APIRouter()

@router.get("/prediction")
async def get_prediction():
    return {
        "location": "Gangtok",
        "district": "Gangtok",
        "state": "Sikkim",
        "risk_level": "HIGH",
        "probability": 0.78,
        "forecast_window": "6–12 hours",
        "risk_factors": ["Heavy rainfall", "High soil saturation", "Steep slope"],
        "status": "LIVE",
        "updated_at": "2026-09-13T12:00:00Z",
        "analysis": "Estimated landslide probability is highest during the next 6–12 hours.",
    }
