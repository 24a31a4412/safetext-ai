from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field


router = APIRouter(
    prefix="/api/report",
    tags=["Report Scam"],
)


class ScamReport(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=5000,
    )

    category: str = Field(
        default="General",
        max_length=100,
    )

    risk_score: int = Field(
        default=0,
        ge=0,
        le=100,
    )

    prediction: str = Field(
        default="SCAM",
        max_length=50,
    )


@router.post("")
def report_scam(report: ScamReport):
    message = report.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty.",
        )

    return {
        "success": True,
        "message": "Scam report submitted successfully.",
        "data": {
            "category": report.category,
            "risk_score": report.risk_score,
            "prediction": report.prediction,
        },
    }