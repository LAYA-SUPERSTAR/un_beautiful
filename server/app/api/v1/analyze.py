"""
图片分析接口模块

提供图片上传和分析的 REST API 接口，支持画质分析和美学评估。
包含完整的图片安全删除机制，确保用户隐私。
"""
import os
import uuid
import cv2
import numpy as np
import base64
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Query
from fastapi.responses import JSONResponse

from app.config import settings
from app.services.beauty_analyzer import BeautyAnalyzer
from app.services.aesthetic_analyzer import AestheticAnalyzer
from app.services.tag_generator import TagGenerator
from app.utils.response import success_response, bad_request, internal_error

router = APIRouter()

beauty_analyzer = BeautyAnalyzer()
aesthetic_analyzer = AestheticAnalyzer()
tag_generator = TagGenerator()


def validate_image(file: UploadFile) -> bool:
    """
    验证上传的图片文件是否符合要求。

    Args:
        file: FastAPI UploadFile 对象。

    Returns:
        bool: 文件有效返回 True，否则返回 False。
    """
    filename = file.filename or ""
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    
    if ext not in settings.allowed_extensions_list:
        return False
    
    content_type = file.content_type or ""
    allowed_content_types = ["image/jpeg", "image/jpg", "image/png"]
    
    return content_type in allowed_content_types


def save_image(file: UploadFile) -> str:
    """
    保存上传的图片文件到临时目录。

    Args:
        file: FastAPI UploadFile 对象。

    Returns:
        str: 保存后的文件名（不含路径）。
    """
    file_ext = file.filename.split(".")[-1].lower() if "." in file.filename else "jpg"
    file_id = str(uuid.uuid4())
    filename = f"{file_id}.{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
    
    return filename


def load_image(file_path: str) -> np.ndarray:
    """
    从文件路径加载图片为 NumPy 数组。

    Args:
        file_path: 图片文件的绝对路径。

    Returns:
        np.ndarray: OpenCV 格式的图片数组（BGR）。

    Raises:
        ValueError: 当图片无法读取时抛出。
    """
    image = cv2.imread(file_path)
    if image is None:
        raise ValueError("无法读取图片文件")
    return image


def safe_delete_file(file_path: str) -> bool:
    """
    安全删除临时文件，确保用户隐私。

    Args:
        file_path: 要删除的文件绝对路径。

    Returns:
        bool: 删除成功返回 True，文件不存在或删除失败返回 False。
    """
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
    except Exception as e:
        print(f"[WARN] 文件删除失败: {file_path}, 错误: {e}")
        return False


def encode_image_to_base64(image: np.ndarray, max_size: int = 800) -> str:
    """
    将图片编码为 Base64 字符串，用于在响应中返回。

    Args:
        image: OpenCV 格式的图片数组（BGR）。
        max_size: 最大尺寸限制，超过则压缩。

    Returns:
        str: Base64 编码的图片字符串。
    """
    height, width = image.shape[:2]
    if max(height, width) > max_size:
        scale = max_size / max(height, width)
        new_width = int(width * scale)
        new_height = int(height * scale)
        image = cv2.resize(image, (new_width, new_height))
    
    _, buffer = cv2.imencode('.jpg', image, [cv2.IMWRITE_JPEG_QUALITY, 85])
    return base64.b64encode(buffer).decode('utf-8')


@router.post("/")
async def analyze_image(
    image: UploadFile = File(..., description="图片文件(JPG/JPEG/PNG)"),
    mode: str = Query("full", description="分析模式: quality/aesthetic/full")
):
    """
    分析上传的图片，返回画质评分和美学评估结果。

    图片分析完成后会自动删除服务器上的临时文件，确保用户隐私安全。

    Args:
        image: 上传的图片文件。
        mode: 分析模式，可选 'quality'（画质）、'aesthetic'（美学）、'full'（完整）。

    Returns:
        JSONResponse: 包含分析结果的统一格式响应。
    """
    file_path = None
    
    try:
        if not validate_image(image):
            return bad_request("图片格式不支持，仅支持 JPG/JPEG/PNG 格式")
        
        if image.size > settings.MAX_FILE_SIZE:
            return bad_request("文件过大，限制在 5MB 以内")
        
        filename = save_image(image)
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        
        try:
            img = load_image(file_path)
        except ValueError as e:
            safe_delete_file(file_path)
            return bad_request(str(e))
        
        analysis_id = str(uuid.uuid4())
        created_at = datetime.now().isoformat()
        
        image_base64 = encode_image_to_base64(img)
        
        result = {
            "analysis_id": analysis_id,
            "image_base64": image_base64,
            "created_at": created_at,
            "quality_report": None,
            "aesthetic_report": None,
            "heatmap_data": None
        }
        
        if mode in ["quality", "beauty", "full"]:
            quality_scores = beauty_analyzer.analyze(img)
            quality_tags = tag_generator.generate_quality_report(quality_scores)
            result["quality_report"] = {**quality_scores, **quality_tags}
        
        if mode in ["aesthetic", "full"]:
            aesthetic_scores = aesthetic_analyzer.analyze(img)
            aesthetic_tags = tag_generator.generate_aesthetic_report(aesthetic_scores)
            result["aesthetic_report"] = {**aesthetic_scores, **aesthetic_tags}
        
        safe_delete_file(file_path)
        
        return success_response(data=result, message="分析完成")
    
    except Exception as e:
        if file_path:
            safe_delete_file(file_path)
        import traceback
        traceback.print_exc()
        return internal_error(str(e))


@router.post("/quality")
async def analyze_quality(
    image: UploadFile = File(..., description="图片文件(JPG/JPEG/PNG)")
):
    """
    仅进行画质分析。

    Args:
        image: 上传的图片文件。

    Returns:
        JSONResponse: 包含画质分析结果的响应。
    """
    return await analyze_image(image, mode="quality")


@router.post("/aesthetic")
async def analyze_aesthetic(
    image: UploadFile = File(..., description="图片文件(JPG/JPEG/PNG)")
):
    """
    仅进行美学评估。

    Args:
        image: 上传的图片文件。

    Returns:
        JSONResponse: 包含美学评估结果的响应。
    """
    return await analyze_image(image, mode="aesthetic")