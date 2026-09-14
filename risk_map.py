from fastapi import APIRouter, Query

router = APIRouter()

LOCATION_COORDINATES = [
    ("Gangtok", "Gangtok", "Sikkim", 27.3389, 88.6065),
    ("Darjeeling", "Darjeeling", "West Bengal", 27.0360, 88.2627),
    ("Shillong", "East Khasi Hills", "Meghalaya", 25.5788, 91.8933),
]


@router.get("/location")
async def get_location(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
):
    name, district, state, matched_latitude, matched_longitude = min(
        LOCATION_COORDINATES,
        key=lambda location: (location[3] - latitude) ** 2 + (location[4] - longitude) ** 2,
    )
    return {
        "latitude": latitude,
        "longitude": longitude,
        "location": {
            "name": name,
            "district": district,
            "state": state,
            "latitude": matched_latitude,
            "longitude": matched_longitude,
        },
        "message": f"Showing monitoring data for {name}, {state}",
    }

@router.get("/risk-map")
async def get_risk_map():
    return {
        "locations": [
            {
                "id": "location001",
                "name": "Gangtok",
                "district": "Gangtok",
                "state": "Sikkim",
                "latitude": 27.3389,
                "longitude": 88.6065,
                "probability": 0.78,
                "risk_level": "HIGH",
                "rainfall_24h": 96,
                "forecast_rainfall_6h": 42,
                "soil_moisture": 81,
                "slope": 37,
                "elevation": 842,
                "peak_window": "6–12 hours",
                "risk_factors": ["Heavy rainfall", "High soil saturation", "Steep slope"],
                "timestamp": "2026-09-13T12:00:00Z",
            },
            {
                "id": "location002",
                "name": "Darjeeling",
                "district": "Darjeeling",
                "state": "West Bengal",
                "latitude": 27.0360,
                "longitude": 88.2627,
                "probability": 0.61,
                "risk_level": "MODERATE",
                "rainfall_24h": 64,
                "forecast_rainfall_6h": 30,
                "soil_moisture": 68,
                "slope": 30,
                "elevation": 2124,
                "peak_window": "3–6 hours",
                "risk_factors": ["Saturated ground", "Road cut slope"],
                "timestamp": "2026-09-13T11:42:00Z",
            },
            {
                "id": "location003",
                "name": "Shillong",
                "district": "East Khasi Hills",
                "state": "Meghalaya",
                "latitude": 25.5788,
                "longitude": 91.8933,
                "probability": 0.54,
                "risk_level": "MODERATE",
                "rainfall_24h": 59,
                "forecast_rainfall_6h": 24,
                "soil_moisture": 66,
                "slope": 27,
                "elevation": 1500,
                "peak_window": "0–3 hours",
                "risk_factors": ["Persistent rainfall", "Weak soil profile"],
                "timestamp": "2026-09-13T11:35:00Z",
            }
        ]
    }
