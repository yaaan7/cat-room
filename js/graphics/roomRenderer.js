/**
 * Cat Room - SVG Room Renderer
 * Renders cozy room elements inside the enlarged LCD screen frame.
 */

export class RoomRenderer {
  static renderRoomSvg(slotsData = {}, catSvgContent = '') {
    const wp = slotsData.wallpaper || 'wp_beige';
    const fl = slotsData.floor || 'fl_wood';

    // Room Colors
    let wpFill = "#fff0f5";
    if (wp === 'wp_pink') wpFill = "#fce4ec";
    if (wp === 'wp_gray') wpFill = "#f5f5f5";

    let flFill = "#ffe0b2";
    if (fl === 'fl_rug') flFill = "#e0f7fa";
    if (fl === 'fl_tile') flFill = "#ffffff";

    return `
      <svg id="mainRoomSvg" viewBox="0 0 440 330" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; display:block;">
        <!-- Room Wallpaper Wall -->
        <rect x="0" y="0" width="440" height="220" fill="${wpFill}" />
        
        <!-- Wallpaper Wall Stripes Pattern -->
        <line x1="0" y1="45" x2="440" y2="45" stroke="rgba(255,117,151,0.08)" stroke-width="2" />
        <line x1="0" y1="105" x2="440" y2="105" stroke="rgba(255,117,151,0.08)" stroke-width="2" />
        <line x1="0" y1="165" x2="440" y2="165" stroke="rgba(255,117,151,0.08)" stroke-width="2" />

        <!-- Checkered Cozy Floor -->
        <polygon points="0,220 440,220 440,330 0,330" fill="${flFill}" />
        <!-- Floor Checkers -->
        <path d="M 0 220 L 440 220 M 0 250 L 440 250 M 0 280 L 440 280 M 0 310 L 440 310" stroke="#f57c00" opacity="0.15" stroke-width="2" />
        <path d="M 70 220 L 25 330 M 140 220 L 105 330 M 220 220 L 210 330 M 300 220 L 315 330 M 370 220 L 405 330" stroke="#f57c00" opacity="0.15" stroke-width="2" />
        
        <!-- Floor Baseboard -->
        <line x1="0" y1="220" x2="440" y2="220" stroke="#d7ccc8" stroke-width="3" opacity="0.8" />

        <!-- Window with Pink Curtains -->
        <g transform="translate(30, 45)">
          <rect x="0" y="0" width="70" height="80" rx="6" fill="#81d4fa" stroke="#ffffff" stroke-width="3.5" />
          <line x1="35" y1="0" x2="35" y2="80" stroke="#ffffff" stroke-width="2" />
          <line x1="0" y1="40" x2="70" y2="40" stroke="#ffffff" stroke-width="2" />
          <!-- Curtains -->
          <path d="M -4 -4 L 18 -4 C 12 30 18 55 4 85 L -4 85 Z" fill="#ffb7c5" />
          <path d="M 74 -4 L 52 -4 C 58 25 52 55 66 85 L 74 85 Z" fill="#ffb7c5" />
        </g>

        <!-- Wall Decor Picture Frame -->
        <g transform="translate(335, 45)">
          <rect x="0" y="0" width="60" height="50" rx="4" fill="#ffffff" stroke="#d7ccc8" stroke-width="3" />
          <path d="M 30 18 Q 30 12 25 12 Q 20 12 20 18 Q 20 24 30 32 Q 40 24 40 18 Q 40 12 35 12 Q 30 12 30 18 Z" fill="#ff7597" />
        </g>

        <!-- Plant Item -->
        <g transform="translate(30, 175)">
          <path d="M 10 24 L 28 24 L 24 40 L 14 40 Z" fill="#b0bec5" />
          <circle cx="19" cy="16" r="9" fill="#81c784" />
          <circle cx="14" cy="11" r="7" fill="#a5d6a7" />
        </g>

        <!-- Bed Cushion Item -->
        <g transform="translate(325, 190)">
          <ellipse cx="40" cy="25" rx="36" ry="16" fill="#ffb7c5" stroke="#ff7597" stroke-width="2" />
          <ellipse cx="40" cy="22" rx="27" ry="11" fill="#ffffff" />
        </g>

        <!-- Bowl Item -->
        <g transform="translate(265, 230)">
          <ellipse cx="16" cy="10" rx="14" ry="8" fill="#90caf9" stroke="#42a5f5" stroke-width="1.5" />
          <ellipse cx="16" cy="8" rx="10" ry="4.5" fill="#795548" />
        </g>

        <!-- Rug Mat Center -->
        <ellipse cx="210" cy="245" rx="65" ry="22" fill="#f8bbd0" opacity="0.65" stroke="#ff7597" stroke-dasharray="3,3" stroke-width="1.5" />

        <!-- Pixel Cat Center Stage -->
        <g transform="translate(155, 110)">
          ${catSvgContent}
        </g>
      </svg>
    `;
  }
}
