"""
画质分析器模块

基于 OpenCV 和 NumPy 实现的图片画质分析引擎。
通过分析皮肤质感、画面均匀度、背景平整度、色彩风格等维度，
综合评估照片的画质质量。
"""
import cv2
import numpy as np
from typing import Dict, Tuple


class BeautyAnalyzer:
    """
    画质分析器类。
    
    分析照片的画质特征，包括皮肤质感、画面均匀度、
    背景平整度、色彩风格等维度，并综合计算画质评分。
    
    Attributes:
        skin_lower: HSV 颜色空间中皮肤颜色的下界阈值。
        skin_upper: HSV 颜色空间中皮肤颜色的上界阈值。
    """

    def __init__(self):
        """
        初始化画质分析器。
        
        设置皮肤颜色检测的 HSV 阈值范围。
        """
        self.skin_lower = np.array([0, 48, 80], dtype=np.uint8)
        self.skin_upper = np.array([20, 255, 255], dtype=np.uint8)

    def analyze_skin_texture(self, image: np.ndarray) -> int:
        """
        分析皮肤质感度。
        
        通过检测皮肤区域的纹理特征和边缘密度，
        评估皮肤的质感程度。纹理越丰富、边缘越清晰，
        表示皮肤质感越好，评分越低（更自然）。
        
        Args:
            image: OpenCV 格式的图片数组（BGR）。
        
        Returns:
            int: 皮肤质感度评分（0-100），数值越低表示越自然。
        """
        try:
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            skin_mask = cv2.inRange(hsv, self.skin_lower, self.skin_upper)
            
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
            skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_OPEN, kernel)
            skin_mask = cv2.morphologyEx(skin_mask, cv2.MORPH_CLOSE, kernel)

            skin_pixels = image[skin_mask > 0]
            
            if skin_pixels.size == 0:
                return 20

            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            skin_gray = gray[skin_mask > 0]

            local_variance = np.zeros_like(skin_gray, dtype=np.float32)
            cv2.GaussianBlur(skin_gray.astype(np.float32), (11, 11), 0, dst=local_variance)
            local_variance = np.abs(skin_gray.astype(np.float32) - local_variance)
            
            avg_variance = np.mean(local_variance)
            
            edges = cv2.Canny(image, 50, 150)
            skin_edges = edges[skin_mask > 0]
            edge_density = np.sum(skin_edges > 0) / max(1, skin_edges.size)

            smoothing_score = int((1 - avg_variance / 30) * 40 + (1 - edge_density) * 60)
            smoothing_score = max(5, min(95, smoothing_score))
            
            return smoothing_score
        except Exception:
            return 25

    def analyze_face_uniformity(self, image: np.ndarray) -> int:
        """
        分析画面均匀度。
        
        通过人脸检测和几何比例分析，评估画面中人脸区域的
        均匀程度。检测人脸的长宽比和左右对称性。
        
        Args:
            image: OpenCV 格式的图片数组（BGR）。
        
        Returns:
            int: 画面均匀度评分（0-100），数值越低表示越均匀。
        """
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            face_cascade = cv2.CascadeClassifier(
                cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            )
            faces = face_cascade.detectMultiScale(gray, 1.3, 5)
            
            if len(faces) == 0:
                return 15

            x, y, w, h = faces[0]
            face_ratio = w / h
            
            ideal_ratio = 0.75
            ratio_deviation = abs(face_ratio - ideal_ratio)

            face_region = image[y:y+h, x:x+w]
            height, width = face_region.shape[:2]
            
            center_x, center_y = width // 2, height // 2
            left_width = np.sum(face_region[:, :center_x, 1] > 100)
            right_width = np.sum(face_region[:, center_x:, 1] > 100)
            
            symmetry_score = 1.0
            if left_width + right_width > 0:
                symmetry_score = 1 - abs(left_width - right_width) / max(left_width, right_width)

            warp_score = int((ratio_deviation * 200 + (1 - symmetry_score) * 50))
            warp_score = max(5, min(95, warp_score))
            
            return warp_score
        except Exception:
            return 20

    def analyze_background_flatness(self, image: np.ndarray) -> int:
        """
        分析背景平整度。
        
        通过检测背景区域的线条和边缘特征，
        评估背景的平整程度。线条越规则、弯曲越少，
        表示背景越平整。
        
        Args:
            image: OpenCV 格式的图片数组（BGR）。
        
        Returns:
            int: 背景平整度评分（0-100），数值越低表示越平整。
        """
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (5, 5), 0)
            edges = cv2.Canny(blurred, 50, 150)

            lines = cv2.HoughLinesP(
                edges, rho=1, theta=np.pi / 180,
                threshold=50, minLineLength=30, maxLineGap=10
            )

            edge_density = np.sum(edges > 0) / edges.size

            angle_variance = 0
            if lines is not None and len(lines) > 1:
                angles = []
                for line in lines:
                    x1, y1, x2, y2 = line[0]
                    angle = np.abs(np.arctan2(y2 - y1, x2 - x1) * 180 / np.pi)
                    angles.append(angle)
                angle_std = np.std(angles)
                angle_variance = min(angle_std / 90, 1)

            curvature_score = 1.0 - edge_density * 2
            complexity_score = min(edge_density * 10, 1)

            line_count = len(lines) if lines is not None else 0
            confidence = min(line_count / 20, 1)

            base_score = angle_variance * 50 + complexity_score * 30 + curvature_score * 20
            distortion_score = int(base_score * confidence * 100)
            distortion_score = max(5, min(95, distortion_score))
            
            return distortion_score
        except Exception:
            return 20

    def analyze_color_style(self, image: np.ndarray) -> int:
        """
        分析色彩风格度。
        
        通过 HSV 颜色空间分析图片的色彩特征，
        包括饱和度、亮度偏差和色彩平衡度，
        评估照片的色彩风格程度。
        
        Args:
            image: OpenCV 格式的图片数组（BGR）。
        
        Returns:
            int: 色彩风格度评分（0-100），数值越低表示越自然。
        """
        try:
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            
            avg_hue = np.mean(hsv[:, :, 0])
            avg_saturation = np.mean(hsv[:, :, 1])
            avg_value = np.mean(hsv[:, :, 2])

            saturation_deviation = abs(avg_saturation - 128) / 128
            value_deviation = abs(avg_value - 128) / 128

            b, g, r = cv2.split(image)
            color_balance = max(np.mean(r), np.mean(g), np.mean(b)) / \
                           (min(np.mean(r), np.mean(g), np.mean(b)) + 1e-6)

            color_shift_score = int((saturation_deviation * 30 + value_deviation * 30 + 
                                    min(color_balance - 1, 0.5) * 40) * 100)
            color_shift_score = max(5, min(95, color_shift_score))
            
            return color_shift_score
        except Exception:
            return 25

    def analyze(self, image: np.ndarray) -> Dict[str, int]:
        """
        执行完整的画质分析。
        
        综合分析皮肤质感、画面均匀度、背景平整度、色彩风格，
        并计算综合画质评分。
        
        Args:
            image: OpenCV 格式的图片数组（BGR）。
        
        Returns:
            Dict[str, int]: 包含以下键的评分字典：
                - skin_smoothing_score: 皮肤质感度（0-100）
                - facial_warp_score: 画面均匀度（0-100）
                - background_distortion_score: 背景平整度（0-100）
                - filter_intensity_score: 色彩风格度（0-100）
                - total_reality_score: 综合画质评分（0-100）
        """
        skin_smoothing = self.analyze_skin_texture(image)
        facial_warp = self.analyze_face_uniformity(image)
        background_distortion = self.analyze_background_flatness(image)
        filter_intensity = self.analyze_color_style(image)

        total_reality_score = int(100 - (
            skin_smoothing * 0.3 +
            facial_warp * 0.25 +
            background_distortion * 0.2 +
            filter_intensity * 0.25
        ))
        total_reality_score = max(0, min(100, total_reality_score))

        return {
            'skin_smoothing_score': skin_smoothing,
            'facial_warp_score': facial_warp,
            'background_distortion_score': background_distortion,
            'filter_intensity_score': filter_intensity,
            'total_reality_score': total_reality_score
        }