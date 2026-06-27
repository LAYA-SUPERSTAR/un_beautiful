"""
标签生成器模块

根据画质评分动态生成等级标签和评语金句。
"""
from typing import Dict, Tuple


class TagGenerator:
    """标签生成器类，负责根据评分生成等级标签和评语。"""
    
    QUALITY_LEVELS = [
        (90, 100, "优秀画质"),
        (70, 89, "良好画质"),
        (50, 69, "一般画质"),
        (30, 49, "待提升画质"),
        (0, 29, "基础画质"),
    ]

    QUALITY_TAGS = [
        (90, 100, "自然风格", "照片画质优秀，细节清晰，色彩自然！"),
        (70, 89, "精致风格", "照片质感良好，画面通透，值得欣赏"),
        (50, 69, "艺术风格", "照片风格独特，氛围感十足，很有特色"),
        (30, 49, "创意风格", "照片富有创意，个性鲜明，别具一格"),
        (0, 29, "简约风格", "照片简洁大方，继续保持，多拍多练"),
    ]

    AESTHETIC_LEVELS = [
        (90, 100, "大师级"),
        (80, 89, "精品"),
        (70, 79, "佳作"),
        (60, 69, "良好"),
        (0, 59, "普通"),
    ]

    AESTHETIC_TAGS = [
        (90, 100, "摄影大师", "光影层次丰富，每一帧都是艺术品！"),
        (80, 89, "专业水准", "色彩饱满，构图精妙，专业级水准！"),
        (70, 79, "质感大片", "画面通透，氛围感十足，值得收藏"),
        (60, 69, "不错之选", "画面清晰，色彩协调，非常不错"),
        (0, 59, "入门新手", "继续努力，多练习就能拍出好照片"),
    ]

    def __init__(self):
        """初始化标签生成器。"""
        pass

    def get_quality_level(self, score: int) -> str:
        """
        根据评分获取画质等级。

        Args:
            score: 画质评分（0-100）。

        Returns:
            对应的画质等级字符串。
        """
        for min_score, max_score, level in self.QUALITY_LEVELS:
            if min_score <= score <= max_score:
                return level
        return "一般画质"

    def get_quality_tag_and_comment(self, score: int) -> Tuple[str, str]:
        """
        根据评分获取画质标签和评语。

        Args:
            score: 画质评分（0-100）。

        Returns:
            元组：(标签字符串, 评语字符串)。
        """
        for min_score, max_score, tag, comment in self.QUALITY_TAGS:
            if min_score <= score <= max_score:
                return tag, comment
        return "精致风格", "照片质感良好，画面通透，值得欣赏"

    def get_aesthetic_level(self, score: int) -> str:
        """
        根据评分获取美学等级。

        Args:
            score: 美学评分（0-100）。

        Returns:
            对应的美学等级字符串。
        """
        for min_score, max_score, level in self.AESTHETIC_LEVELS:
            if min_score <= score <= max_score:
                return level
        return "良好"

    def get_aesthetic_tag_and_comment(self, score: int) -> Tuple[str, str]:
        """
        根据评分获取美学标签和评语。

        Args:
            score: 美学评分（0-100）。

        Returns:
            元组：(标签字符串, 评语字符串)。
        """
        for min_score, max_score, tag, comment in self.AESTHETIC_TAGS:
            if min_score <= score <= max_score:
                return tag, comment
        return "不错之选", "画面清晰，色彩协调，非常不错"

    def generate_quality_report(self, scores: Dict[str, int]) -> Dict[str, str]:
        """
        生成画质分析报告。

        Args:
            scores: 包含各项评分的字典，需包含 'total_reality_score' 键。

        Returns:
            包含 'quality_level'、'quality_tag'、'quality_comment' 的字典。
        """
        total_score = scores['total_reality_score']
        level = self.get_quality_level(total_score)
        tag, comment = self.get_quality_tag_and_comment(total_score)
        
        return {
            'quality_level': level,
            'quality_tag': tag,
            'quality_comment': comment
        }

    def generate_aesthetic_report(self, scores: Dict[str, int]) -> Dict[str, str]:
        """
        生成美学评估报告。

        Args:
            scores: 包含各项评分的字典，需包含 'total_aesthetic_score' 键。

        Returns:
            包含 'aesthetic_level'、'aesthetic_tag'、'aesthetic_comment' 的字典。
        """
        total_score = scores['total_aesthetic_score']
        level = self.get_aesthetic_level(total_score)
        tag, comment = self.get_aesthetic_tag_and_comment(total_score)
        
        return {
            'aesthetic_level': level,
            'aesthetic_tag': tag,
            'aesthetic_comment': comment
        }