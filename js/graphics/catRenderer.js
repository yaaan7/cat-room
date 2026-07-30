/**
 * Cat Room - High-Detail Cute Kitten Graphic Renderer
 * Unmistakably an adorable kitten with triangular cat ears, whiskers, cat nose (▲), cat mouth (ω), and curved wagging tail.
 */

import { BEHAVIOR_STATES } from '../config.js';

export class CatRenderer {
  static renderSvg(state = BEHAVIOR_STATES.IDLE) {
    const defs = `
      <defs>
        <radialGradient id="catFur" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="70%" stop-color="#fff0f5" />
          <stop offset="100%" stop-color="#ffb7c5" />
        </radialGradient>
        
        <radialGradient id="catEye" cx="35%" cy="35%" r="60%">
          <stop offset="0%" stop-color="#70a1ff" />
          <stop offset="70%" stop-color="#1e90ff" />
          <stop offset="100%" stop-color="#0984e3" />
        </radialGradient>

        <linearGradient id="earInner" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ff7597" />
          <stop offset="100%" stop-color="#ffb7c5" />
        </linearGradient>

        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    `;

    // Dynamic Facial & Body Feature Components
    let eyeLeft = `
      <g transform="translate(102, 95)">
        <ellipse cx="0" cy="0" rx="12" ry="15" fill="#2d3436" />
        <ellipse cx="0" cy="0" rx="10" ry="13" fill="url(#catEye)" />
        <circle cx="-3" cy="-5" r="4.5" fill="#ffffff" />
        <circle cx="3" cy="4" r="2" fill="#ffffff" />
      </g>
    `;
    let eyeRight = `
      <g transform="translate(158, 95)">
        <ellipse cx="0" cy="0" rx="12" ry="15" fill="#2d3436" />
        <ellipse cx="0" cy="0" rx="10" ry="13" fill="url(#catEye)" />
        <circle cx="-3" cy="-5" r="4.5" fill="#ffffff" />
        <circle cx="3" cy="4" r="2" fill="#ffffff" />
      </g>
    `;

    // Cute Cat Mouth (ω) & Nose (▲)
    let mouth = `<path d="M 120 114 Q 130 122 130 114 Q 130 122 140 114" fill="none" stroke="#2d3436" stroke-width="2.5" stroke-linecap="round" />`;
    let nose = `<path d="M 130 109 L 126 104 Q 130 102 134 104 Z" fill="#ff4757" />`;
    
    // Prominent Triangular Cat Ears
    let earLeft = `
      <g transform="translate(75, 45)">
        <path d="M 25 35 Q -5 -15 0 -25 Q 15 -15 45 15 Z" fill="url(#catFur)" stroke="#ff7597" stroke-width="3" />
        <path d="M 20 30 Q 3 -5 8 -15 Q 18 -5 38 15 Z" fill="url(#earInner)" opacity="0.85" />
      </g>
    `;
    let earRight = `
      <g transform="translate(185, 45)">
        <path d="M -25 35 Q 5 -15 0 -25 Q -15 -15 -45 15 Z" fill="url(#catFur)" stroke="#ff7597" stroke-width="3" />
        <path d="M -20 30 Q -3 -5 -8 -15 Q -18 -5 -38 15 Z" fill="url(#earInner)" opacity="0.85" />
      </g>
    `;

    // Long Curved Wagging Cat Tail
    let tail = `<path d="M 185 155 Q 240 130 230 85 Q 220 65 235 75 Q 255 110 195 170 Z" fill="#ffb7c5" stroke="#ff7597" stroke-width="2.5" class="anim-purr" />`;
    let bodyAnimClass = "anim-purr";
    let moodOverlay = "";

    switch (state) {
      case BEHAVIOR_STATES.HAPPY:
        eyeLeft = `<path d="M 90 95 Q 102 80 114 95" fill="none" stroke="#2d3436" stroke-width="4" stroke-linecap="round" />`;
        eyeRight = `<path d="M 146 95 Q 158 80 170 95" fill="none" stroke="#2d3436" stroke-width="4" stroke-linecap="round" />`;
        mouth = `<path d="M 120 112 Q 130 128 140 112 Z" fill="#ff7597" stroke="#2d3436" stroke-width="2" />`;
        moodOverlay = `
          <g transform="translate(170, 20)" class="anim-purr">
            <path d="M 10 3 Q 10 0 5 0 Q 0 0 0 3 Q 0 7 10 13 Q 20 7 20 3 Q 20 0 15 0 Q 10 0 10 3 Z" fill="#ff4757" />
          </g>
        `;
        break;

      case BEHAVIOR_STATES.HUNGRY:
        eyeLeft = `
          <g transform="translate(102, 95)">
            <circle cx="0" cy="0" r="13" fill="#2d3436" />
            <circle cx="-3" cy="-3" r="4" fill="#ffffff" />
          </g>
        `;
        eyeRight = `
          <g transform="translate(158, 95)">
            <circle cx="0" cy="0" r="13" fill="#2d3436" />
            <circle cx="-3" cy="-3" r="4" fill="#ffffff" />
          </g>
        `;
        mouth = `<ellipse cx="130" cy="116" rx="6" ry="8" fill="#2d3436" />`;
        moodOverlay = `<path d="M 134 124 Q 136 134 132 138 Q 130 132 134 124 Z" fill="#70a1ff" opacity="0.8" />`;
        break;

      case BEHAVIOR_STATES.SLEEPY:
        eyeLeft = `<line x1="90" y1="95" x2="114" y2="95" stroke="#2d3436" stroke-width="4" stroke-linecap="round" />`;
        eyeRight = `<line x1="146" y1="95" x2="170" y2="95" stroke="#2d3436" stroke-width="4" stroke-linecap="round" />`;
        mouth = `<ellipse cx="130" cy="118" rx="7" ry="10" fill="#ff7597" stroke="#2d3436" stroke-width="2" />`;
        moodOverlay = `<text x="165" y="45" font-size="20">🥱</text>`;
        break;

      case BEHAVIOR_STATES.SLEEPING:
        eyeLeft = `<path d="M 90 95 Q 102 105 114 95" fill="none" stroke="#2d3436" stroke-width="3.5" stroke-linecap="round" />`;
        eyeRight = `<path d="M 146 95 Q 158 105 170 95" fill="none" stroke="#2d3436" stroke-width="3.5" stroke-linecap="round" />`;
        mouth = `<path d="M 124 112 Q 130 116 136 112" fill="none" stroke="#2d3436" stroke-width="2" />`;
        bodyAnimClass = "anim-sleep";
        tail = `<path d="M 175 165 Q 200 175 190 190 Z" fill="#ffb7c5" />`;
        moodOverlay = `
          <g transform="translate(170, 25)" class="anim-sleep">
            <text font-size="22" fill="#a55eea" font-weight="bold">Zzz...</text>
          </g>
        `;
        break;

      case BEHAVIOR_STATES.STARTLED:
        eyeLeft = `
          <g transform="translate(102, 95)">
            <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#2d3436" stroke-width="2" />
            <circle cx="0" cy="0" r="4" fill="#2d3436" />
          </g>
        `;
        eyeRight = `
          <g transform="translate(158, 95)">
            <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#2d3436" stroke-width="2" />
            <circle cx="0" cy="0" r="4" fill="#2d3436" />
          </g>
        `;
        mouth = `<circle cx="130" cy="116" r="7" fill="#2d3436" />`;
        bodyAnimClass = "anim-shake";
        moodOverlay = `<path d="M 175 60 C 170 70 180 80 180 80 C 180 80 185 70 175 60 Z" fill="#70a1ff" />`;
        break;

      case BEHAVIOR_STATES.ANGRY:
        eyeLeft = `
          <g transform="translate(102, 95)">
            <path d="M -12 -10 L 10 4" stroke="#ff4757" stroke-width="4.5" stroke-linecap="round" />
            <circle cx="0" cy="3" r="6" fill="#2d3436" />
          </g>
        `;
        eyeRight = `
          <g transform="translate(158, 95)">
            <path d="M 12 -10 L -10 4" stroke="#ff4757" stroke-width="4.5" stroke-linecap="round" />
            <circle cx="0" cy="3" r="6" fill="#2d3436" />
          </g>
        `;
        mouth = `<path d="M 120 120 Q 130 110 140 120" fill="none" stroke="#ff4757" stroke-width="3.5" stroke-linecap="round" />`;
        tail = `<path d="M 185 150 L 235 90 L 245 102 L 195 162 Z" fill="#ff4757" class="anim-shake" />`;
        moodOverlay = `
          <g transform="translate(165, 20)" class="anim-shake">
            <path d="M 0 12 L 8 0 L 12 8 L 20 4 L 16 16 Z" fill="#ff4757" />
          </g>
        `;
        break;

      case BEHAVIOR_STATES.INDIFFERENT:
        eyeLeft = `<ellipse cx="107" cy="95" rx="7" ry="5" fill="#2d3436" />`;
        eyeRight = `<ellipse cx="163" cy="95" rx="7" ry="5" fill="#2d3436" />`;
        mouth = `<line x1="122" y1="114" x2="138" y2="114" stroke="#2d3436" stroke-width="2.5" stroke-linecap="round" />`;
        moodOverlay = `<text x="165" y="45" font-size="20">💤</text>`;
        break;
    }

    return `
      ${defs}
      <g id="catKittenGroup" class="${bodyAnimClass}">
        <!-- Soft Floor Shadow -->
        <ellipse cx="130" cy="180" rx="65" ry="14" fill="rgba(0,0,0,0.18)" filter="url(#softGlow)" />
        
        <!-- Long Curved Wagging Cat Tail -->
        ${tail}
        
        <!-- Fluffy Body Base -->
        <path d="M 75 130 Q 65 180 130 180 Q 195 180 185 130 Q 180 100 130 100 Q 80 100 75 130 Z" fill="url(#catFur)" stroke="#ff7597" stroke-width="3" />
        
        <!-- White Fluffy Chest Belly -->
        <path d="M 100 135 Q 90 172 130 172 Q 170 172 160 135 Q 150 115 130 115 Q 110 115 100 135 Z" fill="#ffffff" opacity="0.95" />
        
        <!-- Cute Front Paws with Pink Toe Beans -->
        <g transform="translate(95, 168)">
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="#ffffff" stroke="#ff7597" stroke-width="2" />
          <circle cx="-3" cy="2" r="2" fill="#ff7597" />
          <circle cx="2" cy="2.5" r="2" fill="#ff7597" />
          <circle cx="5" cy="1" r="1.5" fill="#ff7597" />
        </g>
        <g transform="translate(165, 168)">
          <ellipse cx="0" cy="0" rx="12" ry="8" fill="#ffffff" stroke="#ff7597" stroke-width="2" />
          <circle cx="-5" cy="1" r="1.5" fill="#ff7597" />
          <circle cx="-2" cy="2.5" r="2" fill="#ff7597" />
          <circle cx="3" cy="2" r="2" fill="#ff7597" />
        </g>
        
        <!-- Prominent Triangular Cat Ears -->
        ${earLeft}
        ${earRight}
        
        <!-- Fluffy Kitten Head -->
        <path d="M 70 95 Q 60 50 130 50 Q 200 50 190 95 Q 195 122 130 122 Q 65 122 70 95 Z" fill="url(#catFur)" stroke="#ff7597" stroke-width="3" />
        
        <!-- Cheek Blush -->
        <ellipse cx="88" cy="104" rx="10" ry="6" fill="#ff4757" opacity="0.35" filter="url(#softGlow)" />
        <ellipse cx="172" cy="104" rx="10" ry="6" fill="#ff4757" opacity="0.35" filter="url(#softGlow)" />
        
        <!-- Eyes -->
        ${eyeLeft}
        ${eyeRight}
        
        <!-- Cat Nose (▲) & Mouth (ω) -->
        ${nose}
        ${mouth}
        
        <!-- Prominent Cat Whiskers -->
        <g stroke="#2d3436" stroke-width="2" stroke-linecap="round" opacity="0.85">
          <line x1="68" y1="98" x2="32" y2="92" />
          <line x1="66" y1="106" x2="26" y2="108" />
          <line x1="68" y1="114" x2="32" y2="122" />

          <line x1="192" y1="98" x2="228" y2="92" />
          <line x1="194" y1="106" x2="234" y2="108" />
          <line x1="192" y1="114" x2="228" y2="122" />
        </g>

        <!-- Dynamic Emotion Overlay -->
        ${moodOverlay}
      </g>
    `;
  }
}
