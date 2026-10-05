from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.ml.scam_detector import analyze_message


router = APIRouter(
    prefix="/api/scanner",
    tags=["Scanner"],
)


class ScanRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=5000,
    )


@router.post("/analyze")
def analyze(request: ScanRequest):
    message = request.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty.",
        )

    result = analyze_message(message)

    return {
        "success": True,
        "data": result,
    }