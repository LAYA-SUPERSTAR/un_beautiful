from pydantic import BaseModel, Field
from typing import Optional


class BeautyReport(BaseModel):
    skin_smoothing_score: int = Field(..., ge=0, le=100, description="皮肤磨皮度(0-100)")
    facial_warp_score: int = Field(..., ge=0, le=100, description="脸型扭曲度(0-100)")
    background_distortion_score: int = Field(..., ge=0, le=100, description="背景畸变度(0-100)")
    filter_intensity_score: int = Field(..., ge=0, le=100, description="滤镜强度(0-100)")
    total_reality_score: int = Field(..., ge=0, le=100, description="综合真实度(0-100)")
    beauty_level: str = Field(..., description="美颜等级")
    beauty_tag: str = Field(..., description="美颜标签")
    beauty_comment: str = Field(..., description="标签金句")


class AestheticReport(BaseModel):
    clarity_score: int = Field(..., ge=0, le=100, description="清晰度(0-100)")
    color_richness_score: int = Field(..., ge=0, le=100, description="色彩丰富度(0-100)")
    contrast_score: int = Field(..., ge=0, le=100, description="对比度(0-100)")
    composition_score: int = Field(..., ge=0, le=100, description="构图评分(0-100)")
    lighting_score: int = Field(..., ge=0, le=100, description="光影层次(0-100)")
    total_aesthetic_score: int = Field(..., ge=0, le=100, description="综合美学得分(0-100)")
    aesthetic_level: str = Field(..., description="美学等级")
    aesthetic_tag: str = Field(..., description="美学标签")
    aesthetic_comment: str = Field(..., description="标签金句")


class HeatmapData(BaseModel):
    skin_area: Optional[str] = Field(None, description="皮肤区域热力图(Base64)")
    distortion_area: Optional[str] = Field(None, description="畸变区域热力图(Base64)")


class AnalyzeResponse(BaseModel):
    analysis_id: str = Field(..., description="分析ID")
    image_url: str = Field(..., description="图片URL")
    created_at: str = Field(..., description="创建时间")
    beauty_report: Optional[BeautyReport] = Field(None, description="美颜还原检测报告")
    aesthetic_report: Optional[AestheticReport] = Field(None, description="画质美学评估报告")
    heatmap_data: Optional[HeatmapData] = Field(None, description="热力图数据")
