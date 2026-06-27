from typing import Any, Optional
from fastapi.responses import JSONResponse


def success_response(data: Any = None, message: str = "操作成功") -> JSONResponse:
    return JSONResponse(
        status_code=200,
        content={
            "code": 200,
            "data": data,
            "message": message
        }
    )


def error_response(
    code: int = 400,
    message: str = "操作失败",
    data: Any = None
) -> JSONResponse:
    return JSONResponse(
        status_code=code,
        content={
            "code": code,
            "data": data,
            "message": message
        }
    )


def bad_request(message: str = "请求参数错误", data: Any = None) -> JSONResponse:
    return error_response(code=400, message=message, data=data)


def internal_error(message: str = "服务器内部错误", data: Any = None) -> JSONResponse:
    return error_response(code=500, message=message, data=data)
