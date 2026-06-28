export function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}

const MAX_SIZE = 5 * 1024 * 1024;

export const compressImage = async (file: File, maxSize: number = MAX_SIZE): Promise<File> => {
  if (file.size <= maxSize) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxDim = 2048;
        
        if (width > maxDim || height > maxDim) {
          const ratio = maxDim / Math.max(width, height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建 Canvas 上下文'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        let compressedBlob: Blob | null = null;
        
        const compressStep = () => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('图片压缩失败'));
              return;
            }
            
            if (blob.size > maxSize && quality > 0.1) {
              quality -= 0.1;
              compressStep();
            } else {
              compressedBlob = blob;
              const compressedFile = new File([compressedBlob], file.name, {
                type: file.type,
                lastModified: file.lastModified
              });
              resolve(compressedFile);
            }
          }, file.type || 'image/jpeg', quality);
        };
        
        compressStep();
      };
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
};