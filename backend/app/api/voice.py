from fastapi import APIRouter, File, HTTPException, UploadFile

from app.ml.scam_detector import analyze_message
from app.voice.analyzer import transcribe_audio


router = APIRouter(
    prefix="/api/voice",
    tags=["Voice Scanner"],
)

MAX_AUDIO_SIZE = 10 * 1024 * 1024  # 10 MB

ALLOWED_AUDIO_TYPES = {
    "audio/ogg",
    "audio/wav",
    "audio/x-wav",
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/x-m4a",
    "audio/webm",
}


@router.post("/analyze")
async def analyze_voice(file: UploadFile = File(...)):
    # Validate MIME type
    if file.content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported audio format.",
        )

    # Read only up to the allowed limit + 1 byte.
    audio_bytes = await file.read(MAX_AUDIO_SIZE + 1)

    if not audio_bytes:
        raise HTTPException(
            status_code=400,
            detail="Audio file is empty.",
        )

    # File-size protection
    if len(audio_bytes) > MAX_AUDIO_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Audio file size cannot exceed 10 MB.",
        )

    # Determine audio format
    file_format = (
        file.filename.rsplit(".", 1)[-1].lower()
        if file.filename and "." in file.filename
        else "ogg"
    )

    allowed_extensions = {
        "ogg",
        "wav",
        "mp3",
        "mpeg",
        "mp4",
        "m4a",
        "webm",
    }

    if file_format not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported audio file extension.",
        )

    # Audio transcription
    try:
        extracted_text = transcribe_audio(
            audio_bytes,
            file_format,
        )
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Voice transcription failed.",
        )

    if not extracted_text:
        raise HTTPException(
            status_code=400,
            detail="Could not understand the audio.",
        )

    result = analyze_message(extracted_text)

    return {
        "success": True,
        "data": {
            "transcribed_text": extracted_text,
            "analysis": result,
        },
    }