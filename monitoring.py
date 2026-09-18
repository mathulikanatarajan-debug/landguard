from fastapi import APIRouter

router = APIRouter()

@router.get("/monitoring-stations")
async def get_monitoring_stations():
    return {
        "stations": [
            {
                "name": "Sikkim Ridge Station",
                "status": "ONLINE",
                "last_updated": "2026-09-13T12:00:00Z",
                "available_sensors": 9,
                "latitude": 27.3389,
                "longitude": 88.6065,
            },
            {
                "name": "Shillong Weather Node",
                "status": "ONLINE",
                "last_updated": "2026-09-13T11:55:00Z",
                "available_sensors": 6,
                "latitude": 25.5788,
                "longitude": 91.8933,
            },
            {
                "name": "Itanagar Terrain Unit",
                "status": "OFFLINE",
                "last_updated": "2026-09-13T10:10:00Z",
                "available_sensors": 4,
                "latitude": 28.218,
                "longitude": 94.7278,
            }
        ]
    }
