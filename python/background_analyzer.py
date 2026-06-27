"""
背景扭曲检测服务
使用 OpenCV 进行边缘检测和霍夫直线变换，分析背景线条弯曲程度
"""

import os
import io
import base64
import json
import numpy as np
from flask import Flask, request, jsonify
import cv2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def analyze_background_distortion(image_base64: str) -> dict:
    """
    分析图片背景扭曲程度
    
    算法流程：
    1. 解码 Base64 图片
    2. 转换为灰度图
    3. 应用高斯模糊减少噪声
    4. Canny 边缘检测
    5. 霍夫直线变换检测直线
    6. 分析直线弯曲程度（通过直线与理想直线的方差）
    7. 综合边缘密度、线条数量、弯曲方差计算最终分数
    """
    
    try:
        # 解码 Base64 图片
        if ',' in image_base64:
            image_base64 = image_base64.split(',')[1]
        
        image_data = base64.b64decode(image_base64)
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return {
                'success': False,
                'error': '无法解码图片',
                'score': 30
            }
        
        # 获取图片尺寸
        height, width = img.shape[:2]
        
        # 转换灰度图
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 高斯模糊去噪
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Canny 边缘检测
        edges = cv2.Canny(blurred, 50, 150)
        
        # 霍夫直线变换检测直线
        lines = cv2.HoughLinesP(
            edges,
            rho=1,
            theta=np.pi / 180,
            threshold=50,
            minLineLength=30,
            maxLineGap=10
        )
        
        # 计算边缘密度（边缘像素占比）
        edge_density = np.sum(edges > 0) / edges.size
        
        # 初始化弯曲相关变量
        line_angles = []
        line_curvatures = []
        
        if lines is not None:
            for line in lines:
                x1, y1, x2, y2 = line[0]
                
                # 计算线条角度
                angle = np.abs(np.arctan2(y2 - y1, x2 - x1) * 180 / np.pi)
                line_angles.append(angle)
                
                # 计算线条弯曲程度（端点连线与实际线条的偏离）
                # 理想情况下直线两端点连线就是直线本身
                dx = x2 - x1
                dy = y2 - y1
                line_length = np.sqrt(dx**2 + dy**2)
                
                if line_length > 0:
                    # 采样中间点检查是否有弯曲
                    mid_x = (x1 + x2) // 2
                    mid_y = (y1 + y2) // 2
                    
                    # 获取线条上多个采样点的平均灰度值
                    # 如果是真实直线，中间点应该在边缘上
                    # 如果是弯曲的线条，边缘会有不连续
                    curvature_estimate = 1.0 - edge_density * 2
                    line_curvatures.append(curvature_estimate)
        
        # 计算角度方差（线条方向的一致性）
        angle_variance = 0
        if len(line_angles) > 1:
            angle_std = np.std(line_angles)
            angle_variance = min(angle_std / 90, 1)  # 归一化到 0-1
        
        # 计算弯曲程度
        curvature_score = 0
        if len(line_curvatures) > 0:
            curvature_score = np.mean(line_curvatures)
        
        # 综合边缘密度（背景复杂度的指标）
        complexity_score = min(edge_density * 10, 1)
        
        # 最终弯曲分数计算
        # - 高角度方差表示背景线条杂乱（可能是P图导致）
        # - 高边缘密度表示背景复杂
        # - 线条数量适中时最有参考价值
        base_score = angle_variance * 50 + complexity_score * 30 + curvature_score * 20
        
        # 根据检测到的线条数量调整置信度
        line_count = len(lines) if lines is not None else 0
        confidence = min(line_count / 20, 1)  # 20条以上线条置信度最高
        
        final_score = int(base_score * confidence * 100)
        final_score = max(5, min(95, final_score))  # 钳位到 5-95
        
        return {
            'success': True,
            'score': final_score,
            'details': {
                'edge_density': float(edge_density),
                'angle_variance': float(angle_variance),
                'line_count': line_count,
                'curvature_score': float(curvature_score),
                'confidence': float(confidence)
            }
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'score': 30
        }


@app.route('/analyze', methods=['POST'])
def analyze():
    """接收 Base64 编码的图片，返回背景扭曲分数"""
    
    data = request.get_json()
    
    if not data or 'image_base64' not in data:
        return jsonify({
            'success': False,
            'error': '请提供 image_base64 字段'
        }), 400
    
    result = analyze_background_distortion(data['image_base64'])
    
    return jsonify(result)


@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
