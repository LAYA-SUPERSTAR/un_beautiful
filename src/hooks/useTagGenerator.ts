import { useMemo } from 'react';
import { getTagsByScore, getQuoteByScore } from '../config/tags';

export const useTagGenerator = (score: number) => {
  const tags = useMemo(() => getTagsByScore(score), [score]);
  
  const quote = useMemo(() => getQuoteByScore(score), [score]);
  
  const randomTags = useMemo(() => {
    const shuffled = [...tags].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [tags]);

  return {
    tags,
    randomTags,
    quote
  };
};
