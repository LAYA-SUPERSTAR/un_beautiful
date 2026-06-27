"""
美学评估器模块

基于 OpenCV 和 NumPy 实现的图片美学质量评估引擎。
从清晰度、色彩丰富度、对比度、构图、光影层次等维度，
综合评估照片的美学质量。
"""
import cv2
import numpy as np
from typing import Dict


class AestheticAnalyzer:
    """
    美学评估器类。
    
    从多个美学维度评估照片质量，包括清晰度、色彩丰富度、
    对比度、构图、光影层次等，并综合计算美学评分。
    """

    def __init__(self):
        """
        初始化美学评估器。
        """
        pass

    def analyze_clarity(self, image: np.ndarray) -> int:
        """
        分析图片清晰度。
        
        通过拉普拉斯方差和梯度能量评估图片的清晰程度。
        数值越高表示图片越清晰，细节越丰富。
        
        Args:
            image: OpenCV 格式的图片数组（BGR）。
        
        Returns:
            int: 清晰度评分（0-100），数值越高表示越清晰。
        """
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            laplacian = cv2.Laplacian(gray, cv2.CV_64F)
            laplacian_var = np.var(laplacian)
            
            sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
            sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
            gradient_magnitude = np.sqrt(sobel_x ** 2 + sobel_y ** 2)
            gradient_energy = np.mean(gradient_magnitude)

            clarity_score = int((laplacian_var / 100) * 30 + (gradient_energy / 50) * 70)
            clarity_score = max(5, min(95, clarity_score))
            
            return clarity_score
        except Exception:
            return 50

    def analyze_color_richness(self, image: np.ndarray) -> int:
        """
        分析色彩丰富度。
        
        通过 HSV 颜色空间的饱和度熵和色相熵，
        评估图片的色彩丰富程度。
        
        Args:
            image: OpenCV 格式的图片数组（BGR）。
        
        Returns:
            int: 色彩丰富度评分（0-100），数值越高表示色彩越丰富。
        """
        try:
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            
            saturation = hsv[:, :, 1]
            saturation_hist = cv2.calcHist([saturation], [0], None, [256], [0, 256])
            saturation_entropy = -np.sum(saturation_hist * np.log(saturation_hist + 1e-10))
            
            hue = hsv[:, :, 0]
            hue_hist = cv2.calcHist([hue], [0], None, [360], [0, 360])
            hue_entropy = -np.sum(hue_hist * np.log(hue_hist + 1e-10))

            avg_saturation = np.mean(saturation)
            saturation_score = avg_saturation / 255

            color_entropy = (saturation_entropy / 8 + hue_entropy / 10) / 2

            richness_score = int((saturation_score * 40 + color_entropy * 60) * 100)
            richness_score = max(5, min(95, richness_score))
            
            return richness_score
        except Exception:
            return 50

    def analyze_contrast(self, image: np.ndarray) -> int:
        """
        分析对比度。
        
        通过灰度直方图分布和动态范围，
        评估图片的明暗对比程度。
        
        Args:
            image: OpenCV 格式的图片数组（BGR）。
        
        Returns:
            int: 对比度评分（0-100），数值越高表示对比越分明。
        """
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
            hist_norm = hist / hist.sum()
            
            cdf = hist_norm.cumsum()
            cdf_min = cdf[cdf > 0].min()
            cdf_normalized = (cdf - cdf_min) / (1 - cdf_min)
            
            contrast_ratio = np.percentile(gray, 90) / (np.percentile(gray, 10) + 1e-6)

            dynamic_range = np.max(gray) - np.min(gray)
            range_score = dynamic_range / 255

            contrast_score = int((contrast_ratio / 10 * 40 + range_score * 30 + 
                                (1 - np.mean(cdf_normalized[:50])) * 30) * 100)
            contrast_score = max(5, min(95, contrast_score))
            
            return contrast_score
        except Exception:
            return 50

    def analyze_composition(self, image: np.ndarray) -> int:
        """
        分析构图质量。
        
        通过人脸位置与三分法网格的契合度，
        或边缘重心与黄金分割比例的关系，
        评估图片的构图质量。
        
        Args:
            image: OpenCV 格式的图片数组（BGR）。
        
        Returns:
            int: 构图评分（0-100），数值越高表示构图越好。
        """
        try:
            height, width = image.shape[:2]
            
            face_cascade = cv2.CascadeClassifier(
                cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            )
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.3, 5)

            if len(faces) > 0:
                x, y, w, h = faces[0]
                center_x = (x + w / 2) / width
                center_y = (y + h / 2) / height

                rule_of_thirds_lines_x = [1/3, 2/3]
                rule_of_thirds_lines_y = [1/3, 2/3]
                
                min_dist_x = min(abs(center_x - line) for line in rule_of_thirds_lines_x)
                min_dist_y = min(abs(center_y - line) for line in rule_of_thirds_lines_y)
                
                thirds_score = max(0, 1 - min_dist_x * 3) * max(0, 1 - min_dist_y * 3)
                
                composition_score = int(thirds_score * 100)
            else:
                edges = cv2.Canny(image, 50, 150)
                edge_centroid_y = np.sum(np.arange(height) * np.sum(edges, axis=1)) / max(1, np.sum(edges))
                centroid_ratio = edge_centroid_y / height
                
                golden_ratio = 0.618
                composition_score = int(max(0, 1 - abs(centroid_ratio - golden_ratio) * 5) * 100)
            
            composition_score = max(5, min(95, composition_score))
            return composition_score
        except Exception:
            return 50

    def analyze_lighting(self, image: np.ndarray) -> int:
        """
        分析光影层次。
        
        通过亮度分布直方图和曝光程度，
        评估图片的光影层次质量。
        
        Args:
            image: OpenCV 格式的图片数组（BGR）。
        
        Returns:
            int: 光影层次评分（0-100），数值越高表示光影层次越好。
        """
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
            hist_norm = hist / hist.sum()

            brightness = np.mean(gray) / 255
            
            mid_tone_ratio = np.sum(hist_norm[64:192])
            
            exposure_score = 1 - abs(brightness - 0.5) * 2
            
            lighting_score = int((mid_tone_ratio * 50 + exposure_score * 50) * 100)
            lighting_score = max(5, min(95, lighting_score))
            
            return lighting_score
        except Exception:
            return 50

    def analyze(self, image: np.ndarray) -> Dict[str, int]:
        """
        执行完整的美学评估。
        
        综合分析清晰度、色彩丰富度、对比度、构图、光影层次，
        并计算综合美学评分。
        
        Args:
            image: OpenCV 格式的图片数组（BGR）。
        
        Returns:
            Dict[str, int]: 包含以下键的评分字典：
                - clarity_score: 清晰度（0-100）
                - color_richness_score: 色彩丰富度（0-100）
                - contrast_score: 对比度（0-100）
                - composition_score: 构图（0-100）
                - lighting_score: 光影层次（0-100）
                - total_aesthetic_score: 综合美学评分（0-100）
        """
        clarity = self.analyze_clarity(image)
        color_richness = self.analyze_color_richness(image)
        contrast = self.analyze_contrast(image)
        composition = self.analyze_composition(image)
        lighting = self.analyze_lighting(image)

        total_aesthetic_score = int(
            clarity * 0.25 +
            color_richness * 0.2 +
            contrast * 0.2 +
            composition * 0.15 +
            lighting * 0.2
        )
        total_aesthetic_score = max(0, min(100, total_aesthetic_score))

        return {
            'clarity_score': clarity,
            'color_richness_score': color_richness,
            'contrast_score': contrast,
            'composition_score': composition,
            'lighting_score': lighting,
            'total_aesthetic_score': total_aesthetic_score
        }