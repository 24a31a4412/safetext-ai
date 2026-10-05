from io import BytesIO

from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image

from app.ml.scam_detector import analyze_message
from app.ocr.screenshot import extract_text_from_image


router = APIRouter(
    prefix="/api/screenshot",
    tags=["Screenshot Scanner"],
)

MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/analyze")
async def analyze_screenshot(file: UploadFile = File(...)):
    # Basic content-type validation
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image.",
        )

    # Read only up to the allowed limit + 1 byte.
    image_bytes = await file.read(MAX_IMAGE_SIZE + 1)

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )

    # File-size protection
    if len(image_bytes) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image size cannot exceed 5 MB.",
        )

    # Verify that the uploaded bytes are actually a readable image.
    try:
        image = Image.open(BytesIO(image_bytes))
        image.verify()
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not a valid image.",
        )

    # OCR processing
    try:
        extracted_text = extract_text_from_image(image_bytes)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="OCR processing failed.",
        )

    if not extracted_text:
        raise HTTPException(
            status_code=400,
            detail="No readable text was detected in the screenshot.",
        )

    result = analyze_message(extracted_text)

    return {
        "success": True,
        "data": {
            "extracted_text": extracted_text,
            "analysis": result,
        },
    }