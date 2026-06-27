from pydantic import BaseModel, Field
from typing import Any, Optional


class ApiResponse(BaseModel):
    code: int = Field(200, description="状态码")
    data: Optional[Any] = Field(None, description="响应数据")
    message: str = Field("操作成功", description="提示信息")


class ApiErrorResponse(BaseModel):
    code: int = Field(400, description="错误码")
    data: Optional[Any] = Field(None, description="错误详情")
    message: str = Field("操作失败", description="错误信息")
