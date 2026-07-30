/**
 * Cat Room - SVG Room Renderer
 * Renders cozy room elements inside the LCD screen frame.
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
      <svg id="mainRoomSvg" viewBox="0 0 320 260" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; display:block;">
        <!-- Room Wallpaper Wall -->
        <rect x="0" y="0" width="320" height="175" fill="${wpFill}" />
        
        <!-- Wallpaper Wall Stripes Pattern -->
        <line x1="0" y1="35" x2="320" y2="35" stroke="rgba(255,117,151,0.08)" stroke-width="2" />
        <line x1="0" y1="85" x2="320" y2="85" stroke="rgba(255,117,151,0.08)" stroke-width="2" />
        <line x1="0" y1="135" x2="320" y2="135" stroke="rgba(255,117,151,0.08)" stroke-width="2" />

        <!-- Checkered Cozy Floor -->
        <polygon points="0,175 320,175 320,260 0,260" fill="${flFill}" />
        <!-- Floor Checkers -->
        <path d="M 0 175 L 320 175 M 0 195 L 320 195 M 0 220 L 320 220 M 0 245 L 320 245" stroke="#f57c00" opacity="0.15" stroke-width="2" />
        <path d="M 50 175 L 15 260 M 100 175 L 75 260 M 160 175 L 150 260 M 220 175 L 230 260 M 270 175 L 300 260" stroke="#f57c00" opacity="0.15" stroke-width="2" />
        
        <!-- Floor Baseboard -->
        <line x1="0" y1="175" x2="320" y2="175" stroke="#d7ccc8" stroke-width="3" />

        <!-- Window with Pink Curtains -->
        <g transform="translate(20, 35)">
          <rect x="0" y="0" width="55" height="65" rx="6" fill="#81d4fa" stroke="#ffffff" stroke-width="3" />
          <line x1="27.5" y1="0" x2="27.5" y2="65" stroke="#ffffff" stroke-width="2" />
          <line x1="0" y1="32.5" x2="55" y2="32.5" stroke="#ffffff" stroke-width="2" />
          <!-- Curtains -->
          <path d="M -4 -4 L 14 -4 C 10 25 15 50 3 70 L -4 70 Z" fill="#ffb7c5" />
          <path d="M 59 -4 L 41 -4 C 45 25 40 50 52 70 L 59 70 Z" fill="#ffb7c5" />
        </g>

        <!-- Wall Decor Picture Frame -->
        <g transform="translate(235, 35)">
          <rect x="0" y="0" width="50" height="40" rx="4" fill="#ffffff" stroke="#d7ccc8" stroke-width="3" />
          <path d="M 25 12 Q 25 8 21 8 Q 17 8 17 12 Q 17 17 25 24 Q 33 17 33 12 Q 33 8 29 8 Q 25 8 25 12 Z" fill="#ff7597" />
        </g>

        <!-- Plant Item -->
        <g transform="translate(20, 140)">
          <path d="M 8 20 L 24 20 L 21 35 L 11 35 Z" fill="#b0bec5" />
          <circle cx="16" cy="14" r="8" fill="#81c784" />
          <circle cx="12" cy="9" r="6" fill="#a5d6a7" />
        </g>

        <!-- Bed Cushion Item -->
        <g transform="translate(230, 150)">
          <ellipse cx="32" cy="20" rx="30" ry="13" fill="#ffb7c5" stroke="#ff7597" stroke-width="2" />
          <ellipse cx="32" cy="18" rx="22" ry="9" fill="#ffffff" />
        </g>

        <!-- Bowl Item -->
        <g transform="translate(190, 182)">
          <ellipse cx="12" cy="8" rx="11" ry="6" fill="#90caf9" stroke="#42a5f5" stroke-width="1.5" />
          <ellipse cx="12" cy="6" rx="8" ry="3.5" fill="#795548" />
        </g>

        <!-- Rug Mat Center -->
        <ellipse cx="150" cy="195" rx="48" ry="16" fill="#f8bbd0" opacity="0.65" stroke="#ff7597" stroke-dasharray="3,3" stroke-width="1.5" />

        <!-- Cute Kitten Center Stage -->
        <g transform="translate(85, 80)">
          ${catSvgContent}
        </g>
      </svg>
    `;
  }
}
