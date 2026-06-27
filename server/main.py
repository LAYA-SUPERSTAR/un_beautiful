import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.staticfiles import StaticFiles
    
    print("[INFO] FastAPI imports successful")
except Exception as e:
    print(f"[ERROR] FastAPI imports failed: {e}")
    raise

try:
    from app.config import settings
    print(f"[INFO] Config loaded: PORT={settings.PORT}")
except Exception as e:
    print(f"[ERROR] Config load failed: {e}")
    raise

try:
    from app.api.v1 import router as api_v1_router
    print("[INFO] API router loaded")
except Exception as e:
    print(f"[ERROR] API router load failed: {e}")
    raise

try:
    from app.utils.exceptions import register_exception_handlers
    print("[INFO] Exception handlers loaded")
except Exception as e:
    print(f"[ERROR] Exception handlers load failed: {e}")
    raise

app = FastAPI(
    title="美颜还原/画质美学评估 API",
    description="基于 FastAPI 的照片分析服务",
    version="1.0.0"
)

print("[INFO] FastAPI app created")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("[INFO] CORS middleware added")

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

print("[INFO] Static files mounted")

app.include_router(api_v1_router, prefix="/api/v1")

print("[INFO] API router included")

register_exception_handlers(app)

print("[INFO] Exception handlers registered")

@app.get("/")
async def root():
    return {"code": 200, "data": {"message": "API 服务已启动"}, "message": "success"}

@app.get("/health")
async def health_check():
    return {"code": 200, "data": {"status": "ok"}, "message": "success"}

print("[INFO] Root routes registered")
print(f"[INFO] Server ready on http://{settings.HOST}:{settings.PORT}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=False,
        workers=1
    )
