from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.scanner import router as scanner_router
from app.api.screenshot import router as screenshot_router
from app.api.voice import router as voice_router
from app.api.report import router as report_router
from app.api.heatmap import router as heatmap_router
from app.api.trends import router as trends_router


app = FastAPI(
    title="SafeText AI API",
    description="AI-Powered Scam Message Detection and Risk Analysis System",
    version="1.0.0",
)

# CORS
# Only allow requests from the SafeText AI frontend.
ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=[
        "GET",
        "POST",
        "OPTIONS",
    ],
    allow_headers=[
        "Content-Type",
        "Authorization",
    ],
)


# API Routes
app.include_router(scanner_router)
app.include_router(screenshot_router)
app.include_router(voice_router)
app.include_router(report_router)
app.include_router(heatmap_router)
app.include_router(trends_router)


@app.get("/")
def root():
    return {
        "message": "SafeText AI API is running",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
    }