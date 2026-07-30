/**
 * Cat Room - SVG Room Furniture & Slot Item Renderer
 */

export class RoomRenderer {
  static renderRoomSvg(slotsData = {}, catSvgContent = '') {
    const wp = slotsData.wallpaper || 'wp_beige';
    const fl = slotsData.floor || 'fl_wood';
    const bed = slotsData.bed || 'bed_cushion';
    const bowl = slotsData.bowl || 'bowl_plastic';
    const tower = slotsData.catTower || 'tower_mini';
    const cushion = slotsData.cushion || 'cushion_default';
    const toy = slotsData.toy || 'toy_yarn';
    const win = slotsData.window || 'win_day';
    const wallDecor = slotsData.wallDecor || 'wall_frame';

    // Wallpaper Background Graphics
    let wpFill = "#fce4ec";
    if (wp === 'wp_pink') wpFill = "#f8bbd0";
    if (wp === 'wp_gray') wpFill = "#eceff1";

    // Floor Graphics
    let flFill = "#d7ccc8";
    if (fl === 'fl_rug') flFill = "#b0bec5";
    if (fl === 'fl_tile') flFill = "#ffffff";

    // Window Background Item Graphic
    let windowSvg = `
      <g transform="translate(60, 40)">
        <rect x="0" y="0" width="140" height="120" rx="12" fill="#81d4fa" stroke="#ffffff" stroke-width="6" />
        <line x1="70" y1="0" x2="70" y2="120" stroke="#ffffff" stroke-width="4" />
        <line x1="0" y1="60" x2="140" y2="60" stroke="#ffffff" stroke-width="4" />
        <circle cx="110" cy="35" r="16" fill="#ffee58" />
      </g>
    `;
    if (win === 'win_night') {
      windowSvg = `
        <g transform="translate(60, 40)">
          <rect x="0" y="0" width="140" height="120" rx="12" fill="#1a237e" stroke="#ffffff" stroke-width="6" />
          <line x1="70" y1="0" x2="70" y2="120" stroke="#ffffff" stroke-width="4" />
          <line x1="0" y1="60" x2="140" y2="60" stroke="#ffffff" stroke-width="4" />
          <path d="M 100 25 A 15 15 0 0 0 115 45 A 12 12 0 0 1 100 25 Z" fill="#fff59d" />
          <circle cx="40" cy="30" r="2" fill="#ffffff" />
          <circle cx="85" cy="80" r="2" fill="#ffffff" />
        </g>
      `;
    }

    // Wall Decor Item Graphic
    let wallDecorSvg = `
      <g transform="translate(480, 50)">
        <rect x="0" y="0" width="90" height="70" rx="4" fill="#8d6e63" stroke="#5d4037" stroke-width="4" />
        <rect x="8" y="8" width="74" height="54" fill="#ffffff" />
        <path d="M 20 48 L 40 25 L 60 48 Z" fill="#81c784" />
        <circle cx="62" cy="22" r="6" fill="#ffb74d" />
      </g>
    `;

    // Bed Item Graphic
    let bedSvg = `
      <g transform="translate(80, 260)">
        <ellipse cx="60" cy="40" rx="65" ry="25" fill="#f8bbd0" stroke="#f48fb1" stroke-width="4" />
        <ellipse cx="60" cy="35" rx="50" ry="18" fill="#ffffff" />
      </g>
    `;
    if (bed === 'bed_box') {
      bedSvg = `
        <g transform="translate(70, 240)">
          <rect x="0" y="0" width="120" height="60" fill="#d7ccc8" stroke="#8d6e63" stroke-width="4" />
          <path d="M 0 0 L 20 -15 L 140 -15 L 120 0 Z" fill="#b0bec5" />
        </g>
      `;
    }

    // Cat Tower Item Graphic
    let towerSvg = `
      <g transform="translate(480, 180)">
        <rect x="40" y="0" width="15" height="160" fill="#a1887f" />
        <ellipse cx="47" cy="40" rx="45" ry="12" fill="#d7ccc8" />
        <ellipse cx="47" cy="100" rx="55" ry="15" fill="#d7ccc8" />
        <rect x="10" y="150" width="75" height="15" fill="#8d6e63" />
      </g>
    `;

    // Food Bowl Item Graphic
    let bowlSvg = `
      <g transform="translate(400, 320)">
        <ellipse cx="30" cy="20" rx="28" ry="12" fill="#90caf9" stroke="#42a5f5" stroke-width="3" />
        <ellipse cx="30" cy="17" rx="20" ry="8" fill="#795548" />
      </g>
    `;

    // Toy Item Graphic
    let toySvg = `
      <g transform="translate(230, 330)">
        <circle cx="20" cy="15" r="14" fill="#ff7043" stroke="#d84315" stroke-width="2" />
        <path d="M 10 10 Q 20 25 30 10" fill="none" stroke="#ffffff" stroke-width="2" />
      </g>
    `;

    return `
      <svg id="mainRoomSvg" viewBox="0 0 640 400" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; min-height:400px; display:block;">
        <!-- Wallpaper Wall -->
        <rect x="0" y="0" width="640" height="280" fill="${wpFill}" />
        
        <!-- Floor -->
        <polygon points="0,280 640,280 640,400 0,400" fill="${flFill}" />
        <line x1="0" y1="280" x2="640" y2="280" stroke="rgba(0,0,0,0.15)" stroke-width="4" />

        <!-- Wall Items -->
        ${windowSvg}
        ${wallDecorSvg}

        <!-- Floor Items -->
        ${bedSvg}
        ${towerSvg}
        ${bowlSvg}
        ${toySvg}

        <!-- Cat Character Center Stage -->
        <g transform="translate(170, 100)">
          ${catSvgContent}
        </g>
      </svg>
    `;
  }
}
