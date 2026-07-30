/**
 * Cat Room - SVG Room & In-Screen Retro HUD Renderer
 * Renders cozy pixel/vector room inside Tamagotchi screen + bottom in-screen metric bars.
 */

export class RoomRenderer {
  static renderRoomSvg(slotsData = {}, catSvgContent = '', metricsData = { hunger: 30, happiness: 70, affection: 20, energy: 80, stress: 10 }) {
    const wp = slotsData.wallpaper || 'wp_beige';
    const fl = slotsData.floor || 'fl_wood';
    const bed = slotsData.bed || 'bed_cushion';
    const bowl = slotsData.bowl || 'bowl_plastic';
    const win = slotsData.window || 'win_day';
    const wallDecor = slotsData.wallDecor || 'wall_frame';

    // Room Colors
    let wpFill = "#fff5f5";
    if (wp === 'wp_pink') wpFill = "#fce4ec";
    if (wp === 'wp_gray') wpFill = "#f5f5f5";

    // In-Screen Metric Bar Helper (Draws pastel segmented progress bar inside LCD)
    const drawInScreenMetricBar = (x, y, icon, label, val, color) => {
      const segs = Math.round((val / 100) * 5); // 5 segments total
      let segsHtml = "";
      for (let i = 0; i < 5; i++) {
        const segColor = i < segs ? color : "rgba(0,0,0,0.1)";
        segsHtml += `<rect x="${x + i * 9}" y="${y + 24}" width="7" height="8" rx="2" fill="${segColor}" />`;
      }

      return `
        <g transform="translate(${x}, ${y})">
          <text x="21" y="0" font-size="10" font-family="'Outfit', 'Noto Sans KR', sans-serif" font-weight="600" fill="#666666" text-anchor="middle">${label}</text>
          <text x="21" y="16" font-size="14" text-anchor="middle">${icon}</text>
          ${segsHtml}
        </g>
      `;
    };

    const meterHunger = drawInScreenMetricBar(15, 275, "🍽️", "Hunger", metricsData.hunger, "#ff7597");
    const meterHappiness = drawInScreenMetricBar(85, 275, "😃", "Happiness", metricsData.happiness, "#ffbe76");
    const meterAffection = drawInScreenMetricBar(155, 275, "💖", "Affection", metricsData.affection, "#ff79ac");
    const meterEnergy = drawInScreenMetricBar(225, 275, "⚡", "Energy", metricsData.energy, "#70a1ff");
    const meterStress = drawInScreenMetricBar(295, 275, "🌧️", "Stress", metricsData.stress, "#a55eea");

    return `
      <svg id="mainRoomSvg" viewBox="0 0 360 330" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; display:block;">
        <!-- Room Wallpaper Wall -->
        <rect x="0" y="0" width="360" height="200" fill="${wpFill}" />
        
        <!-- Wallpaper Wall Stripes Pattern -->
        <line x1="0" y1="40" x2="360" y2="40" stroke="rgba(255,117,151,0.08)" stroke-width="2" />
        <line x1="0" y1="90" x2="360" y2="90" stroke="rgba(255,117,151,0.08)" stroke-width="2" />
        <line x1="0" y1="140" x2="360" y2="140" stroke="rgba(255,117,151,0.08)" stroke-width="2" />

        <!-- Checkered Cozy Floor -->
        <polygon points="0,200 360,200 360,265 0,265" fill="#ffe0b2" />
        <!-- Floor Checkers -->
        <path d="M 0 200 L 360 200 M 0 220 L 360 220 M 0 245 L 360 245" stroke="#f57c00" opacity="0.15" stroke-width="2" />
        <path d="M 60 200 L 20 265 M 120 200 L 90 265 M 180 200 L 170 265 M 240 200 L 250 265 M 300 200 L 330 265" stroke="#f57c00" opacity="0.15" stroke-width="2" />
        
        <!-- Floor Baseboard -->
        <line x1="0" y1="200" x2="360" y2="200" stroke="#d7ccc8" stroke-width="3" />

        <!-- Top Day Counter Badge -->
        <g transform="translate(130, 10)">
          <rect x="0" y="0" width="100" height="22" rx="11" fill="#ffffff" stroke="#ffb7c5" stroke-width="1.5" />
          <text x="50" y="15" font-size="11" font-family="'Outfit', sans-serif" font-weight="600" fill="#ff7597" text-anchor="middle">♡ Day 1 ♡</text>
        </g>

        <!-- Window with Pink Curtains -->
        <g transform="translate(30, 45)">
          <rect x="0" y="0" width="65" height="75" rx="6" fill="#81d4fa" stroke="#ffffff" stroke-width="4" />
          <line x1="32.5" y1="0" x2="32.5" y2="75" stroke="#ffffff" stroke-width="2" />
          <line x1="0" y1="37.5" x2="65" y2="37.5" stroke="#ffffff" stroke-width="2" />
          <!-- Curtains -->
          <path d="M -4 -4 L 16 -4 C 12 30 18 60 4 80 L -4 80 Z" fill="#ffb7c5" />
          <path d="M 69 -4 L 49 -4 C 53 30 47 60 61 80 L 69 80 Z" fill="#ffb7c5" />
        </g>

        <!-- Wall Decor Picture Frame -->
        <g transform="translate(260, 45)">
          <rect x="0" y="0" width="55" height="45" rx="4" fill="#ffffff" stroke="#d7ccc8" stroke-width="3" />
          <path d="M 27.5 15 Q 27.5 10 23 10 Q 18 10 18 15 Q 18 20 27.5 28 Q 37 20 37 15 Q 37 10 32 10 Q 27.5 10 27.5 15 Z" fill="#ff7597" />
        </g>

        <!-- Plant Item -->
        <g transform="translate(30, 160)">
          <path d="M 10 25 L 30 25 L 26 42 L 14 42 Z" fill="#b0bec5" />
          <circle cx="20" cy="18" r="10" fill="#81c784" />
          <circle cx="15" cy="12" r="8" fill="#a5d6a7" />
        </g>

        <!-- Bed Cushion Item -->
        <g transform="translate(255, 175)">
          <ellipse cx="40" cy="25" rx="36" ry="16" fill="#ffb7c5" stroke="#ff7597" stroke-width="2" />
          <ellipse cx="40" cy="22" rx="28" ry="11" fill="#ffffff" />
        </g>

        <!-- Bowl Item -->
        <g transform="translate(210, 210)">
          <ellipse cx="15" cy="10" rx="14" ry="7" fill="#90caf9" stroke="#42a5f5" stroke-width="1.5" />
          <ellipse cx="15" cy="8" rx="10" ry="4" fill="#795548" />
        </g>

        <!-- Rug Mat Center -->
        <ellipse cx="180" cy="225" rx="55" ry="20" fill="#f8bbd0" opacity="0.6" stroke="#ff7597" stroke-dasharray="4,4" stroke-width="1.5" />

        <!-- Pixel Cat Center Stage -->
        <g transform="translate(130, 115)">
          ${catSvgContent}
        </g>

        <!-- Bottom In-Screen LCD HUD Metric Bars Divider -->
        <rect x="0" y="265" width="360" height="65" fill="#ffffff" rx="8" />
        <line x1="0" y1="265" x2="360" y2="265" stroke="#e0e0e0" stroke-width="1.5" />

        <!-- 5 Metric Bars In-Screen -->
        ${meterHunger}
        ${meterHappiness}
        ${meterAffection}
        ${meterEnergy}
        ${meterStress}
      </svg>
    `;
  }
}
