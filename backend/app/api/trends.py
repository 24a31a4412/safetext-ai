from fastapi import APIRouter

router = APIRouter()


@router.get("/api/trends")
def get_trends():
    return {
        "success": True,
        "data": {
            "total_scans": 500,
            "scam_messages": 320,
            "safe_messages": 180,
            "average_risk_score": 68,
            "daily_scans": [
                {"date": "Mon", "scans": 45},
                {"date": "Tue", "scans": 62},
                {"date": "Wed", "scans": 55},
                {"date": "Thu", "scans": 78},
                {"date": "Fri", "scans": 91},
                {"date": "Sat", "scans": 84},
                {"date": "Sun", "scans": 85},
            ],
        },
    }