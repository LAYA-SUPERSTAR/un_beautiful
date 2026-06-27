export const TAGS = {
  ultraHighReality: [
    '素颜女神', '天生丽质', '毫无破绽', '美颜绝缘体',
    '原相机王者', '真实力选手', '无滤镜挑战', '自然美',
    '神颜免检', '原生态', '纯天然', '颜值天花板'
  ],
  highReality: [
    '轻微美颜', '心机女孩', '伪素颜', '氛围感拿捏',
    '轻度磨皮', '小心机', '天生好皮', '微整形既视感',
    '微瑕轻奢', '质感美人', '高级感', '原生态'
  ],
  mediumReality: [
    '照骗达人', '换头术', '妈不认', '重度美颜',
    '科技与狠活', '磨皮十级', '液化大师', '滤镜狂魔',
    '赛博换头', '算法捏人', '像素级还原失败', '美颜粉碎机'
  ],
  lowReality: [
    '赛博降头', '数字奇迹', '骨科手术', '见光死',
    '引力扭曲', '墙缝歪了', '五官漂移', '磨皮到没五官'
  ]
};

export const QUOTES = {
  lowReality: [
    { 
      title: '赛博降头警报', 
      text: '触发赛博降头全面警报！这张脸的含真量低到连路过的AI都要点个举报，你和原图可能只共享了一个名字。', 
      style: 'red',
      emoji: '🚨'
    },
    { 
      title: '骨科手术级别', 
      text: '推脸形变率已达骨科手术级别。精修两小时，敢见光就"见光死"，建议立刻去申请"数字生命"研究所认证。', 
      style: 'red',
      emoji: '🔧'
    },
    { 
      title: '时空引力扭曲', 
      text: '检测到该时空发生严重引力扭曲（墙缝都歪了）。这哪里是照片，这分明是你在赛博世界里亲手捏出来的数字奇迹。', 
      style: 'red',
      emoji: '🌀'
    }
  ],
  mediumReality: [
    { 
      title: '中等意思伪装', 
      text: '互联网中等意思伪装。虽然粉碎了3层赛博磨皮，但看得出来底子还在，就是对美颜相机的依赖比对Wifi还深。', 
      style: 'yellow',
      emoji: '🤖'
    },
    { 
      title: '朋友圈限定版', 
      text: '下巴略微液化，滤镜恰到好处。介于"天生丽质"和"算法捏人"之间的灰色地带，属于"朋友圈限定版"美女/帅哥。', 
      style: 'yellow',
      emoji: '📸'
    },
    { 
      title: '听劝收手吧', 
      text: '技术报告提示：进行了克制的修图。如果线下见面，对方需要眯着眼睛辨认3秒钟。听劝，收手吧，原图就挺好。', 
      style: 'yellow',
      emoji: '💡'
    }
  ],
  highReality: [
    { 
      title: '含真量极高', 
      text: '极高含真量！你只是把滤镜杀死的毛孔救活了而已。这种程度的真实感，在如今的社交网络上堪称"降维打击"。', 
      style: 'green',
      emoji: '✨'
    },
    { 
      title: '清流本流', 
      text: '骨骼比例完全符合人类解剖学，空间未发生任何扭曲。敢拿这张报告去朋友圈，你就是清流本流！', 
      style: 'green',
      emoji: '🦴'
    },
    { 
      title: '美颜沦为工具', 
      text: '基本原生态！美颜相机在你这里沦为了普通的垫光工具，你本人的颜值已经完全不需要算法来多管闲事。', 
      style: 'green',
      emoji: '📷'
    }
  ],
  ultraHighReality: [
    { 
      title: '原生态神颜', 
      text: '🎉 跪了！含真量爆表！荣获【原生态神颜免检认证】。人类最后的容貌尊严和鲜活毛孔，在你这里被完美保住了！', 
      style: 'gold',
      emoji: '👑'
    },
    { 
      title: '算法形同虚设', 
      text: '无惧任何数字取证！算法在你面前形同虚设。请立刻关闭任何美颜功能，因为它们正在拉低你颜值的上限！', 
      style: 'gold',
      emoji: '⚡'
    },
    { 
      title: '纯天然无添加', 
      text: '100%纯天然无添加！检测结果干净得像一面镜子。赶紧把这张带有官方盖章的报告丢到群里，给那些赛博科技脸一点小小的震撼！', 
      style: 'gold',
      emoji: '🌟'
    }
  ]
};

export const getTagsByScore = (score: number): string[] => {
  if (score >= 86) return TAGS.ultraHighReality;
  if (score >= 66) return TAGS.highReality;
  if (score >= 31) return [...TAGS.mediumReality];
  return [...TAGS.lowReality, ...TAGS.mediumReality];
};

export const getQuoteByScore = (score: number) => {
  if (score >= 86) {
    return QUOTES.ultraHighReality[Math.floor(Math.random() * QUOTES.ultraHighReality.length)];
  }
  if (score >= 66) {
    return QUOTES.highReality[Math.floor(Math.random() * QUOTES.highReality.length)];
  }
  if (score >= 31) {
    return QUOTES.mediumReality[Math.floor(Math.random() * QUOTES.mediumReality.length)];
  }
  return QUOTES.lowReality[Math.floor(Math.random() * QUOTES.lowReality.length)];
};
