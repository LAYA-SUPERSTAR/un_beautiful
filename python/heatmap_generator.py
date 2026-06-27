from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64
import io
from PIL import Image

app = Flask(__name__)

def generate_heatmap(original_base64: str, restored_base64: str) -> str:
    try:
        original_data = base64.b64decode(original_base64.split(',')[1])
        restored_data = base64.b64decode(restored_base64.split(',')[1])
        
        original_img = cv2.imdecode(np.frombuffer(original_data, np.uint8), cv2.IMREAD_COLOR)
        restored_img = cv2.imdecode(np.frombuffer(restored_data, np.uint8), cv2.IMREAD_COLOR)
        
        target_size = (512, 512)
        original_resized = cv2.resize(original_img, target_size)
        restored_resized = cv2.resize(restored_img, target_size)
        
        original_gray = cv2.cvtColor(original_resized, cv2.COLOR_BGR2GRAY)
        restored_gray = cv2.cvtColor(restored_resized, cv2.COLOR_BGR2GRAY)
        
        diff = cv2.absdiff(original_gray, restored_gray)
        
        blurred_diff = cv2.GaussianBlur(diff, (31, 31), 0)
        
        heatmap_colored = cv2.applyColorMap(blurred_diff, cv2.COLORMAP_JET)
        
        heatmap_colored_rgb = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
        
        gray_diff = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2GRAY)
        _, alpha_mask = cv2.threshold(gray_diff, 30, 255, cv2.THRESH_BINARY)
        
        heatmap_with_alpha = cv2.merge((
            heatmap_colored_rgb[:, :, 0],
            heatmap_colored_rgb[:, :, 1],
            heatmap_colored_rgb[:, :, 2],
            alpha_mask
        ))
        
        pil_image = Image.fromarray(heatmap_with_alpha, mode='RGBA')
        buffer = io.BytesIO()
        pil_image.save(buffer, format='PNG')
        
        heatmap_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        return f"data:image/png;base64,{heatmap_base64}"
        
    except Exception as e:
        print(f"[Heatmap] 生成失败: {str(e)}")
        return ""

@app.route('/generate-heatmap', methods=['POST'])
def process_heatmap():
    try:
        data = request.get_json()
        original_base64 = data.get('original_image')
        restored_base64 = data.get('restored_image')
        
        if not original_base64 or not restored_base64:
            return jsonify({
                'success': False,
                'error': '缺少图片数据'
            })
        
        heatmap_image = generate_heatmap(original_base64, restored_base64)
        
        if heatmap_image:
            return jsonify({
                'success': True,
                'heatmap_image': heatmap_image,
                'details': '热力图生成成功'
            })
        else:
            return jsonify({
                'success': False,
                'error': '热力图生成失败'
            })
            
    except Exception as e:
        print(f"[Heatmap] 服务错误: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'service': 'heatmap-generator'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)