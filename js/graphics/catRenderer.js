/**
 * Cat Room - Vector SVG Cat Character Graphic Renderer
 */

import { BEHAVIOR_STATES } from '../config.js';

export class CatRenderer {
  static renderSvg(state = BEHAVIOR_STATES.IDLE) {
    let eyePath = `
      <ellipse cx="120" cy="115" rx="8" ry="10" fill="#2d3436" />
      <ellipse cx="180" cy="115" rx="8" ry="10" fill="#2d3436" />
      <circle cx="122" cy="112" r="3" fill="#ffffff" />
      <circle cx="182" cy="112" r="3" fill="#ffffff" />
    `;
    let mouthPath = `<path d="M 142 135 Q 150 142 158 135 Q 150 145 142 135" fill="#ff7597" stroke="#2d3436" stroke-width="2" />`;
    let earLeft = `<polygon points="90,95 70,40 120,70" fill="#ff9ebb" stroke="#ff7597" stroke-width="3" />`;
    let earRight = `<polygon points="210,95 230,40 180,70" fill="#ff9ebb" stroke="#ff7597" stroke-width="3" />`;
    let tailPath = `<path d="M 230 180 Q 270 140 260 100" fill="none" stroke="#ffa4b8" stroke-width="16" stroke-linecap="round" class="anim-purr" />`;
    let bodyClass = "anim-purr";
    let moodEmblem = "";

    switch (state) {
      case BEHAVIOR_STATES.HAPPY:
        eyePath = `
          <path d="M 112 115 Q 120 105 128 115" fill="none" stroke="#2d3436" stroke-width="4" stroke-linecap="round" />
          <path d="M 172 115 Q 180 105 188 115" fill="none" stroke="#2d3436" stroke-width="4" stroke-linecap="round" />
        `;
        mouthPath = `<path d="M 140 132 Q 150 148 160 132 Z" fill="#ff7597" stroke="#2d3436" stroke-width="2" />`;
        moodEmblem = `<text x="210" y="70" font-size="28">💕</text>`;
        break;

      case BEHAVIOR_STATES.HUNGRY:
        eyePath = `
          <circle cx="120" cy="115" r="12" fill="#2d3436" />
          <circle cx="180" cy="115" r="12" fill="#2d3436" />
          <circle cx="123" cy="112" r="4" fill="#ffffff" />
          <circle cx="183" cy="112" r="4" fill="#ffffff" />
        `;
        mouthPath = `<path d="M 145 138 Q 150 132 155 138" fill="none" stroke="#2d3436" stroke-width="3" stroke-linecap="round" />`;
        moodEmblem = `<text x="210" y="70" font-size="24">🐟</text>`;
        break;

      case BEHAVIOR_STATES.SLEEPY:
        eyePath = `
          <line x1="110" y1="115" x2="130" y2="115" stroke="#2d3436" stroke-width="4" stroke-linecap="round" />
          <line x1="170" y1="115" x2="190" y2="115" stroke="#2d3436" stroke-width="4" stroke-linecap="round" />
        `;
        mouthPath = `<ellipse cx="150" cy="138" rx="6" ry="8" fill="#2d3436" />`;
        moodEmblem = `<text x="210" y="70" font-size="24">🥱</text>`;
        break;

      case BEHAVIOR_STATES.SLEEPING:
        eyePath = `
          <path d="M 112 115 Q 120 122 128 115" fill="none" stroke="#2d3436" stroke-width="4" stroke-linecap="round" />
          <path d="M 172 115 Q 180 122 188 115" fill="none" stroke="#2d3436" stroke-width="4" stroke-linecap="round" />
        `;
        mouthPath = `<path d="M 145 135 Q 150 138 155 135" fill="none" stroke="#2d3436" stroke-width="3" />`;
        bodyClass = "anim-sleep";
        tailPath = `<path d="M 220 190 Q 250 200 240 210" fill="none" stroke="#ffa4b8" stroke-width="16" stroke-linecap="round" />`;
        moodEmblem = `<text x="210" y="60" font-size="28" class="anim-sleep">Zzz...</text>`;
        break;

      case BEHAVIOR_STATES.STARTLED:
        eyePath = `
          <circle cx="120" cy="115" r="14" fill="#ffffff" stroke="#2d3436" stroke-width="2" />
          <circle cx="180" cy="115" r="14" fill="#ffffff" stroke="#2d3436" stroke-width="2" />
          <circle cx="120" cy="115" r="4" fill="#2d3436" />
          <circle cx="180" cy="115" r="4" fill="#2d3436" />
        `;
        earLeft = `<polygon points="90,95 50,45 110,65" fill="#ff7597" stroke="#2d3436" stroke-width="3" />`;
        earRight = `<polygon points="210,95 250,45 190,65" fill="#ff7597" stroke="#2d3436" stroke-width="3" />`;
        bodyClass = "anim-shake";
        moodEmblem = `<text x="210" y="60" font-size="28">⚡</text>`;
        break;

      case BEHAVIOR_STATES.ANGRY:
        eyePath = `
          <path d="M 105 102 L 132 118" stroke="#ff4757" stroke-width="5" stroke-linecap="round" />
          <path d="M 195 102 L 168 118" stroke="#ff4757" stroke-width="5" stroke-linecap="round" />
          <circle cx="120" cy="118" r="6" fill="#2d3436" />
          <circle cx="180" cy="118" r="6" fill="#2d3436" />
        `;
        mouthPath = `<path d="M 140 142 Q 150 132 160 142" fill="none" stroke="#ff4757" stroke-width="4" stroke-linecap="round" />`;
        tailPath = `<path d="M 230 180 L 280 120" fill="none" stroke="#ff4757" stroke-width="18" stroke-linecap="round" class="anim-shake" />`;
        moodEmblem = `<text x="210" y="60" font-size="28">💢</text>`;
        break;

      case BEHAVIOR_STATES.INDIFFERENT:
        eyePath = `
          <ellipse cx="125" cy="115" rx="7" ry="5" fill="#2d3436" />
          <ellipse cx="185" cy="115" rx="7" ry="5" fill="#2d3436" />
        `;
        mouthPath = `<line x1="142" y1="135" x2="158" y2="135" stroke="#2d3436" stroke-width="3" stroke-linecap="round" />`;
        tailPath = `<path d="M 230 190 Q 250 200 260 210" fill="none" stroke="#ffa4b8" stroke-width="16" stroke-linecap="round" />`;
        moodEmblem = `<text x="210" y="70" font-size="24">💤</text>`;
        break;
    }

    return `
      <g id="catCharacterGroup" class="${bodyClass}">
        <!-- Shadow -->
        <ellipse cx="150" cy="225" rx="85" ry="18" fill="rgba(0,0,0,0.25)" />
        
        <!-- Tail -->
        ${tailPath}
        
        <!-- Body -->
        <path d="M 85 150 Q 85 220 150 220 Q 215 220 215 150 Q 215 110 150 110 Q 85 110 85 150 Z" fill="#ffa4b8" stroke="#ff7597" stroke-width="4" />
        <ellipse cx="150" cy="175" rx="45" ry="32" fill="#ffffff" opacity="0.8" />
        
        <!-- Ears -->
        ${earLeft}
        ${earRight}
        
        <!-- Head -->
        <ellipse cx="150" cy="115" rx="65" ry="50" fill="#ffa4b8" stroke="#ff7597" stroke-width="4" />
        
        <!-- Cheeks -->
        <circle cx="102" cy="128" r="10" fill="#ff7597" opacity="0.4" />
        <circle cx="198" cy="128" r="10" fill="#ff7597" opacity="0.4" />
        
        <!-- Eyes & Nose & Mouth -->
        ${eyePath}
        <polygon points="150,126 145,121 155,121" fill="#ff4757" />
        ${mouthPath}
        
        <!-- Whiskers -->
        <line x1="75" y1="120" x2="45" y2="115" stroke="#2d3436" stroke-width="2" stroke-linecap="round" />
        <line x1="75" y1="128" x2="40" y2="130" stroke="#2d3436" stroke-width="2" stroke-linecap="round" />
        <line x1="225" y1="120" x2="255" y2="115" stroke="#2d3436" stroke-width="2" stroke-linecap="round" />
        <line x1="225" y1="128" x2="260" y2="130" stroke="#2d3436" stroke-width="2" stroke-linecap="round" />

        <!-- Mood Emblem Overlay -->
        ${moodEmblem}
      </g>
    `;
  }
}
