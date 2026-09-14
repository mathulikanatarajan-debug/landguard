from fastapi import APIRouter

router = APIRouter()

@router.get("/historical-events")
async def get_historical_events():
    return {
        "events": [
            {
                "id": "hist-001",
                "location": "Gangtok",
                "date": "2024-07-17",
                "cause": "Extreme rainfall and slope saturation",
                "source": "Sikkim State Disaster Management Authority",
                "latitude": 27.3389,
                "longitude": 88.6065,
            },
            {
                "id": "hist-002",
                "location": "Darjeeling",
                "date": "2023-08-02",
                "cause": "Heavy monsoon rainfall along cut slopes",
                "source": "IMD and district reports",
                "latitude": 27.0360,
                "longitude": 88.2627,
            },
            {
                "id": "hist-003",
                "location": "Shillong",
                "date": "2022-06-18",
                "cause": "Prolonged rainfall and unstable terrain",
                "source": "Meghalaya disaster advisory",
                "latitude": 25.5788,
                "longitude": 91.8933,
            }
        ]
    }
