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
      <svg id="mainRoomSvg" viewBox="0 0 380 300" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%; display:block;">
        <!-- Room Wallpaper Wall -->
        <rect x="0" y="0" width="380" height="200" fill="${wpFill}" />
        
        <!-- Wallpaper Wall Stripes Pattern -->
        <line x1="0" y1="40" x2="380" y2="40" stroke="rgba(255,117,151,0.08)" stroke-width="2" />
        <line x1="0" y1="95" x2="380" y2="95" stroke="rgba(255,117,151,0.08)" stroke-width="2" />
        <line x1="0" y1="150" x2="380" y2="150" stroke="rgba(255,117,151,0.08)" stroke-width="2" />

        <!-- Checkered Cozy Floor -->
        <polygon points="0,200 380,200 380,300 0,300" fill="${flFill}" />
        <!-- Floor Checkers -->
        <path d="M 0 200 L 380 200 M 0 225 L 380 225 M 0 255 L 380 255 M 0 280 L 380 280" stroke="#f57c00" opacity="0.15" stroke-width="2" />
        <path d="M 60 200 L 20 300 M 120 200 L 90 300 M 190 200 L 180 300 M 260 200 L 270 300 M 320 200 L 350 300" stroke="#f57c00" opacity="0.15" stroke-width="2" />
        
        <!-- Floor Baseboard -->
        <line x1="0" y1="200" x2="380" y2="200" stroke="#d7ccc8" stroke-width="3" />

        <!-- Window with Pink Curtains -->
        <g transform="translate(25, 40)">
          <rect x="0" y="0" width="60" height="70" rx="6" fill="#81d4fa" stroke="#ffffff" stroke-width="3" />
          <line x1="30" y1="0" x2="30" y2="70" stroke="#ffffff" stroke-width="2" />
          <line x1="0" y1="35" x2="60" y2="35" stroke="#ffffff" stroke-width="2" />
          <!-- Curtains -->
          <path d="M -4 -4 L 15 -4 C 10 25 15 50 3 75 L -4 75 Z" fill="#ffb7c5" />
          <path d="M 64 -4 L 45 -4 C 50 25 45 50 57 75 L 64 75 Z" fill="#ffb7c5" />
        </g>

        <!-- Wall Decor Picture Frame -->
        <g transform="translate(280, 40)">
          <rect x="0" y="0" width="55" height="45" rx="4" fill="#ffffff" stroke="#d7ccc8" stroke-width="3" />
          <path d="M 27.5 15 Q 27.5 10 23 10 Q 18 10 18 15 Q 18 20 27.5 28 Q 37 20 37 15 Q 37 10 32 10 Q 27.5 10 27.5 15 Z" fill="#ff7597" />
        </g>

        <!-- Plant Item -->
        <g transform="translate(25, 160)">
          <path d="M 8 20 L 24 20 L 21 35 L 11 35 Z" fill="#b0bec5" />
          <circle cx="16" cy="14" r="8" fill="#81c784" />
          <circle cx="12" cy="9" r="6" fill="#a5d6a7" />
        </g>

        <!-- Bed Cushion Item -->
        <g transform="translate(275, 175)">
          <ellipse cx="35" cy="22" rx="32" ry="14" fill="#ffb7c5" stroke="#ff7597" stroke-width="2" />
          <ellipse cx="35" cy="20" rx="24" ry="10" fill="#ffffff" />
        </g>

        <!-- Bowl Item -->
        <g transform="translate(225, 210)">
          <ellipse cx="14" cy="9" rx="12" ry="7" fill="#90caf9" stroke="#42a5f5" stroke-width="1.5" />
          <ellipse cx="14" cy="7" rx="9" ry="4" fill="#795548" />
        </g>

        <!-- Rug Mat Center -->
        <ellipse cx="180" cy="225" rx="55" ry="18" fill="#f8bbd0" opacity="0.65" stroke="#ff7597" stroke-dasharray="3,3" stroke-width="1.5" />

        <!-- Pixel Cat Center Stage -->
        <g transform="translate(125, 90)">
          ${catSvgContent}
        </g>
      </svg>
    `;
  }
}
