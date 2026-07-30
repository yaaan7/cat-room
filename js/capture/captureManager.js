/**
 * Cat Room - Photo Card Snapshot Capture Manager
 */

export class CaptureManager {
  static async captureRoomAndDownload(catName, behaviorTag, reactionText) {
    const svgElement = document.getElementById('mainRoomSvg');
    if (!svgElement) {
      console.error('Room SVG element not found for capture');
      return;
    }

    const width = 800;
    const height = 620; // 500px stage + 120px polaroid bottom strip

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 1. Draw White Polaroid Frame Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Inner Border Line
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, width - 32, 480);

    // 2. Serialize SVG SVG -> Image
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = 'Anonymous';

    return new Promise((resolve) => {
      img.onload = () => {
        // Draw Room SVG into Top Box
        ctx.drawImage(img, 16, 16, width - 32, 480);
        URL.revokeObjectURL(blobURL);

        // 3. Draw Polaroid Bottom Text Strip
        ctx.fillStyle = '#1e2333';
        ctx.font = 'bold 22px Outfit, "Noto Sans KR", sans-serif';
        ctx.fillText(`🐾 ${catName}의 방`, 32, 532);

        // Date Timestamp
        const now = new Date();
        const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        ctx.fillStyle = '#70a1ff';
        ctx.font = '500 16px Outfit, sans-serif';
        ctx.fillText(`📅 ${dateStr}`, width - 220, 532);

        // Behavior Mood Tag
        ctx.fillStyle = '#ff7597';
        ctx.font = '600 18px "Noto Sans KR", sans-serif';
        ctx.fillText(`[ ${behaviorTag} ]`, 32, 568);

        // Reaction Quote
        ctx.fillStyle = '#555555';
        ctx.font = 'italic 15px "Noto Sans KR", sans-serif';
        const truncatedText = reactionText.length > 38 ? reactionText.substring(0, 38) + '...' : reactionText;
        ctx.fillText(`"${truncatedText}"`, 32, 595);

        // 4. Download Image
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `CatRoom_${catName}_${now.toISOString().slice(0, 10)}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        resolve(dataUrl);
      };
      img.src = blobURL;
    });
  }
}
