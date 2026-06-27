export const BRAND = {
  name: '真亦假',
  fullName: '真亦假 美颜还原',
  logo: '/logo.svg',
  primaryColor: '#FF006E',
  secondaryColor: '#00F5FF',
  slogan: 'AI 智能美颜还原，揭露照片背后的真相',
  colors: {
    primary: '#FF006E',
    primaryLight: '#FF4D94',
    primaryDark: '#CC0058',
    secondary: '#00F5FF',
    secondaryLight: '#33F7FF',
    secondaryDark: '#00C4CC',
    bgPage: '#0A0A14',
    bgCard: '#1A1A33',
    bgHover: '#252540',
    textPrimary: '#ffffff',
    textSecondary: '#B8B8D4',
    textTertiary: '#7878A0',
    success: '#00F5FF',
    warning: '#F59E0B',
    error: '#FF006E',
    lieDetectorGreen: '#00F5FF',
    yellow: '#F59E0B',
    alertRed: '#FF006E'
  }
};

export const SCAN_STEPS = [
  '正在读取图片...',
  '正在检测人脸特征...',
  '正在分析磨皮粉碎度...',
  '正在分析液化推脸形变率...',
  '正在分析时空扭曲痕迹...',
  '正在分析厚码滤镜叠加层数...',
  '正在生成鉴定报告...'
];

export const DIMENSIONS = {
  skin: {
    label: '赛博磨皮粉碎度',
    color: '#FF006E'
  },
  facial: {
    label: '液化推脸形变率',
    color: '#A855F7'
  },
  background: {
    label: '时空扭曲痕迹',
    color: '#00F5FF'
  },
  filter: {
    label: '厚码滤镜叠加层数',
    color: '#F59E0B'
  }
};
