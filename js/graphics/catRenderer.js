/**
 * Cat Room - High-Detail Cute Vector SVG Cat Graphic Renderer
 * Enhanced with fluff textures, detailed anime eyes, blush cheeks, toe beans, and rich state props.
 */

import { BEHAVIOR_STATES } from '../config.js';

export class CatRenderer {
  static renderSvg(state = BEHAVIOR_STATES.IDLE) {
    // Shared Gradient & Pattern Definitions
    const defs = `
      <defs>
        <radialGradient id="furGradient" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fff0f5" />
          <stop offset="50%" stop-color="#ffb7c5" />
          <stop offset="100%" stop-color="#ff9ebb" />
        </radialGradient>
        
        <radialGradient id="eyeSparkle" cx="35%" cy="35%" r="60%">
          <stop offset="0%" stop-color="#70a1ff" />
          <stop offset="70%" stop-color="#2e86de" />
          <stop offset="100%" stop-color="#10ac84" />
        </radialGradient>

        <linearGradient id="innerEar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ff7597" />
          <stop offset="100%" stop-color="#ffb7c5" />
        </linearGradient>

        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    `;

    // Dynamic Facial & Body Feature Components
    let eyeLeft = `
      <g transform="translate(108, 108)">
        <ellipse cx="0" cy="0" rx="14" ry="18" fill="#2d3436" />
        <ellipse cx="0" cy="0" rx="12" ry="16" fill="url(#eyeSparkle)" />
        <ellipse cx="-4" cy="-6" rx="5" ry="7" fill="#ffffff" />
        <circle cx="4" cy="5" r="2.5" fill="#ffffff" />
      </g>
    `;
    let eyeRight = `
      <g transform="translate(172, 108)">
        <ellipse cx="0" cy="0" rx="14" ry="18" fill="#2d3436" />
        <ellipse cx="0" cy="0" rx="12" ry="16" fill="url(#eyeSparkle)" />
        <ellipse cx="-4" cy="-6" rx="5" ry="7" fill="#ffffff" />
        <circle cx="4" cy="5" r="2.5" fill="#ffffff" />
      </g>
    `;

    let mouth = `<path d="M 132 130 Q 140 138 148 130 Q 156 138 164 130" fill="none" stroke="#2d3436" stroke-width="3" stroke-linecap="round" />`;
    let earLeft = `<path d="M 75 80 Q 40 20 100 50 Z" fill="url(#furGradient)" stroke="#ff7597" stroke-width="3" />
                   <path d="M 80 72 Q 52 32 95 54 Z" fill="url(#innerEar)" opacity="0.7" />`;
    let earRight = `<path d="M 205 80 Q 240 20 180 50 Z" fill="url(#furGradient)" stroke="#ff7597" stroke-width="3" />
                    <path d="M 200 72 Q 228 32 185 54 Z" fill="url(#innerEar)" opacity="0.7" />`;
    let tail = `<path d="M 210 170 Q 270 120 250 80 Q 240 60 255 70 Q 275 110 215 185 Z" fill="#ff9ebb" stroke="#ff7597" stroke-width="2" class="anim-purr" />`;
    let bodyAnimClass = "anim-purr";
    let moodProp = "";
    let sweatDrop = "";

    switch (state) {
      case BEHAVIOR_STATES.HAPPY:
        eyeLeft = `<path d="M 94 110 Q 108 92 122 110" fill="none" stroke="#2d3436" stroke-width="4.5" stroke-linecap="round" />`;
        eyeRight = `<path d="M 158 110 Q 172 92 186 110" fill="none" stroke="#2d3436" stroke-width="4.5" stroke-linecap="round" />`;
        mouth = `<path d="M 132 126 Q 140 144 148 126 Q 156 144 164 126 Z" fill="#ff7597" stroke="#2d3436" stroke-width="2.5" />`;
        moodProp = `
          <g transform="translate(185, 30)" class="anim-purr">
            <path d="M 12 4 Q 12 0 8 0 Q 4 0 4 4 Q 4 8 12 14 Q 20 8 20 4 Q 20 0 16 0 Q 12 0 12 4 Z" fill="#ff4757" />
          </g>
          <g transform="translate(70, 35)" class="anim-purr">
            <path d="M 9 3 Q 9 0 6 0 Q 3 0 3 3 Q 3 6 9 10 Q 15 6 15 3 Q 15 0 12 0 Q 9 0 9 3 Z" fill="#ff7597" />
          </g>
        `;
        break;

      case BEHAVIOR_STATES.HUNGRY:
        eyeLeft = `
          <g transform="translate(108, 108)">
            <circle cx="0" cy="0" r="15" fill="#2d3436" />
            <circle cx="-3" cy="-3" r="5" fill="#ffffff" />
          </g>
        `;
        eyeRight = `
          <g transform="translate(172, 108)">
            <circle cx="0" cy="0" r="15" fill="#2d3436" />
            <circle cx="-3" cy="-3" r="5" fill="#ffffff" />
          </g>
        `;
        mouth = `<ellipse cx="140" cy="134" rx="7" ry="10" fill="#2d3436" />`;
        moodProp = `<path d="M 144 144 Q 146 154 142 158 Q 140 152 144 144 Z" fill="#70a1ff" opacity="0.8" />`;
        break;

      case BEHAVIOR_STATES.SLEEPY:
        eyeLeft = `<line x1="94" y1="110" x2="122" y2="110" stroke="#2d3436" stroke-width="4.5" stroke-linecap="round" />`;
        eyeRight = `<line x1="158" y1="110" x2="186" y2="110" stroke="#2d3436" stroke-width="4.5" stroke-linecap="round" />`;
        mouth = `<ellipse cx="140" cy="135" rx="8" ry="11" fill="#ff7597" stroke="#2d3436" stroke-width="2" />`;
        moodProp = `<text x="180" y="55" font-size="22" fill="#ffbe76" font-weight="bold">🥱</text>`;
        break;

      case BEHAVIOR_STATES.SLEEPING:
        eyeLeft = `<path d="M 94 110 Q 108 120 122 110" fill="none" stroke="#2d3436" stroke-width="4" stroke-linecap="round" />`;
        eyeRight = `<path d="M 158 110 Q 172 120 186 110" fill="none" stroke="#2d3436" stroke-width="4" stroke-linecap="round" />`;
        mouth = `<path d="M 134 128 Q 140 133 146 128" fill="none" stroke="#2d3436" stroke-width="2.5" />`;
        bodyAnimClass = "anim-sleep";
        tail = `<path d="M 200 180 Q 230 190 220 205 Z" fill="#ff9ebb" />`;
        moodProp = `
          <g transform="translate(185, 30)" class="anim-sleep">
            <text font-size="24" fill="#a55eea" font-weight="bold" font-family="sans-serif">Zzz...</text>
          </g>
        `;
        break;

      case BEHAVIOR_STATES.STARTLED:
        eyeLeft = `
          <g transform="translate(108, 108)">
            <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="#2d3436" stroke-width="2" />
            <circle cx="0" cy="0" r="4" fill="#2d3436" />
          </g>
        `;
        eyeRight = `
          <g transform="translate(172, 108)">
            <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="#2d3436" stroke-width="2" />
            <circle cx="0" cy="0" r="4" fill="#2d3436" />
          </g>
        `;
        mouth = `<circle cx="140" cy="136" r="8" fill="#2d3436" />`;
        earLeft = `<path d="M 75 80 Q 30 40 90 60 Z" fill="url(#furGradient)" stroke="#2d3436" stroke-width="3" />`;
        earRight = `<path d="M 205 80 Q 250 40 190 60 Z" fill="url(#furGradient)" stroke="#2d3436" stroke-width="3" />`;
        bodyAnimClass = "anim-shake";
        sweatDrop = `<path d="M 195 75 C 190 85 200 95 200 95 C 200 95 205 85 195 75 Z" fill="#70a1ff" />`;
        break;

      case BEHAVIOR_STATES.ANGRY:
        eyeLeft = `
          <g transform="translate(108, 108)">
            <path d="M -16 -12 L 14 6" stroke="#ff4757" stroke-width="5" stroke-linecap="round" />
            <circle cx="0" cy="4" r="7" fill="#2d3436" />
          </g>
        `;
        eyeRight = `
          <g transform="translate(172, 108)">
            <path d="M 16 -12 L -14 6" stroke="#ff4757" stroke-width="5" stroke-linecap="round" />
            <circle cx="0" cy="4" r="7" fill="#2d3436" />
          </g>
        `;
        mouth = `<path d="M 128 138 Q 140 125 152 138" fill="none" stroke="#ff4757" stroke-width="4" stroke-linecap="round" />`;
        tail = `<path d="M 210 160 L 265 95 L 275 110 L 220 175 Z" fill="#ff4757" class="anim-shake" />`;
        moodProp = `
          <g transform="translate(180, 25)" class="anim-shake">
            <path d="M 0 15 L 10 0 L 15 10 L 25 5 L 20 20 Z" fill="#ff4757" />
          </g>
        `;
        break;

      case BEHAVIOR_STATES.INDIFFERENT:
        eyeLeft = `
          <g transform="translate(115, 108)">
            <ellipse cx="0" cy="0" rx="8" ry="6" fill="#2d3436" />
          </g>
        `;
        eyeRight = `
          <g transform="translate(179, 108)">
            <ellipse cx="0" cy="0" rx="8" ry="6" fill="#2d3436" />
          </g>
        `;
        mouth = `<line x1="130" y1="132" x2="150" y2="132" stroke="#2d3436" stroke-width="3" stroke-linecap="round" />`;
        moodProp = `<text x="180" y="55" font-size="22">💤</text>`;
        break;
    }

    return `
      ${defs}
      <g id="catCharacterGroup" class="${bodyAnimClass}">
        <!-- Soft Ground Shadow -->
        <ellipse cx="140" cy="210" rx="75" ry="16" fill="rgba(0,0,0,0.22)" filter="url(#softGlow)" />
        
        <!-- Tail -->
        ${tail}
        
        <!-- Fluffy Body Base -->
        <path d="M 75 140 Q 65 205 140 205 Q 215 205 205 140 Q 200 105 140 105 Q 80 105 75 140 Z" fill="url(#furGradient)" stroke="#ff7597" stroke-width="3.5" />
        
        <!-- White Fluffy Chest Belly -->
        <path d="M 105 145 Q 95 195 140 195 Q 185 195 175 145 Q 165 125 140 125 Q 115 125 105 145 Z" fill="#ffffff" opacity="0.9" />
        
        <!-- Cute Front Paws with Toe Beans -->
        <g transform="translate(100, 185)">
          <ellipse cx="0" cy="0" rx="14" ry="10" fill="#ffffff" stroke="#ff7597" stroke-width="2" />
          <circle cx="-4" cy="2" r="2.5" fill="#ff7597" />
          <circle cx="2" cy="3" r="2.5" fill="#ff7597" />
          <circle cx="6" cy="1" r="2" fill="#ff7597" />
        </g>
        <g transform="translate(180, 185)">
          <ellipse cx="0" cy="0" rx="14" ry="10" fill="#ffffff" stroke="#ff7597" stroke-width="2" />
          <circle cx="-6" cy="1" r="2" fill="#ff7597" />
          <circle cx="-2" cy="3" r="2.5" fill="#ff7597" />
          <circle cx="4" cy="2" r="2.5" fill="#ff7597" />
        </g>
        
        <!-- Ears -->
        ${earLeft}
        ${earRight}
        
        <!-- Fluffy Round Head -->
        <path d="M 75 110 Q 65 60 140 60 Q 215 60 205 110 Q 210 140 140 140 Q 70 140 75 110 Z" fill="url(#furGradient)" stroke="#ff7597" stroke-width="3.5" />
        
        <!-- Cheeks Blush -->
        <ellipse cx="95" cy="120" rx="11" ry="7" fill="#ff4757" opacity="0.35" filter="url(#softGlow)" />
        <ellipse cx="185" cy="120" rx="11" ry="7" fill="#ff4757" opacity="0.35" filter="url(#softGlow)" />
        
        <!-- Eyes -->
        ${eyeLeft}
        ${eyeRight}
        
        <!-- Cute Tiny Pink Nose -->
        <path d="M 140 119 L 134 114 Q 140 112 146 114 Z" fill="#ff4757" />
        
        <!-- Mouth -->
        ${mouth}
        
        <!-- Detailed Whiskers -->
        <g stroke="#2d3436" stroke-width="2" stroke-linecap="round" opacity="0.8">
          <line x1="72" y1="112" x2="38" y2="106" />
          <line x1="70" y1="122" x2="32" y2="124" />
          <line x1="72" y1="130" x2="38" y2="138" />

          <line x1="208" y1="112" x2="242" y2="106" />
          <line x1="210" y1="122" x2="248" y2="124" />
          <line x1="208" y1="130" x2="242" y2="138" />
        </g>

        <!-- Mood Overlays & Props -->
        ${moodProp}
        ${sweatDrop}
      </g>
    `;
  }
}
