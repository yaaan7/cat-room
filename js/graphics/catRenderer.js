/**
 * Cat Room - Pure Retro Pixel-Art Cat Character Renderer
 * Rendered using crisp pixel blocks (shape-rendering="crispEdges").
 * Unmistakably a retro 8-bit / 16-bit pixel kitten!
 */

import { BEHAVIOR_STATES } from '../config.js';

export class CatRenderer {
  static renderSvg(state = BEHAVIOR_STATES.IDLE) {
    const p = 5; // Pixel unit size (5px per pixel block)

    // Helper to draw pixel rectangles
    const px = (x, y, w, h, color) => `<rect x="${x * p}" y="${y * p}" width="${w * p}" height="${h * p}" fill="${color}" />`;

    // Palette
    const C_BLACK = "#2d3436";
    const C_WHITE = "#ffffff";
    const C_PINK = "#ff7597";
    const C_LIGHT_PINK = "#ffb7c5";
    const C_BLUE = "#70a1ff";
    const C_RED = "#ff4757";
    const C_GOLD = "#ffbe76";

    let pixels = "";

    // 1. Pixel Triangular Cat Ears
    pixels += px(5, 1, 3, 3, C_BLACK);   // Left Ear Tip
    pixels += px(4, 2, 5, 4, C_BLACK);
    pixels += px(6, 3, 2, 2, C_LIGHT_PINK); // Inner Ear

    pixels += px(14, 1, 3, 3, C_BLACK);  // Right Ear Tip
    pixels += px(13, 2, 5, 4, C_BLACK);
    pixels += px(14, 3, 2, 2, C_LIGHT_PINK); // Inner Ear

    // 2. Pixel Head Structure
    pixels += px(4, 6, 14, 8, C_BLACK);  // Head Outer Border
    pixels += px(5, 7, 12, 6, C_WHITE);  // Face White Fill

    // Head Top Black Patch
    pixels += px(5, 6, 4, 2, C_BLACK);
    pixels += px(13, 6, 4, 2, C_BLACK);

    // 3. Facial Features per State
    let emotionOverlay = "";

    switch (state) {
      case BEHAVIOR_STATES.HAPPY:
        // Pixel Eye Winks ^ ^
        pixels += px(7, 9, 3, 1, C_BLACK);
        pixels += px(6, 10, 1, 1, C_BLACK);
        pixels += px(8, 10, 1, 1, C_BLACK);

        pixels += px(12, 9, 3, 1, C_BLACK);
        pixels += px(11, 10, 1, 1, C_BLACK);
        pixels += px(13, 10, 1, 1, C_BLACK);

        // Pixel Mouth Open Smile
        pixels += px(10, 11, 2, 2, C_PINK);

        // Floating Pixel Hearts
        emotionOverlay += `
          <g class="anim-purr">
            ${px(1, 3, 2, 2, C_PINK)}
            ${px(0, 2, 1, 1, C_PINK)}
            ${px(2, 2, 1, 1, C_PINK)}
            ${px(19, 4, 2, 2, C_RED)}
          </g>
        `;
        break;

      case BEHAVIOR_STATES.HUNGRY:
        // Wide Pixel Eyes
        pixels += px(7, 8, 3, 3, C_BLACK);
        pixels += px(7, 8, 1, 1, C_WHITE);
        pixels += px(12, 8, 3, 3, C_BLACK);
        pixels += px(12, 8, 1, 1, C_WHITE);

        // Mouth Drool
        pixels += px(10, 12, 2, 1, C_BLACK);
        emotionOverlay += px(11, 13, 1, 2, C_BLUE);
        break;

      case BEHAVIOR_STATES.SLEEPY:
        // Flat Lines - -
        pixels += px(7, 9, 3, 1, C_BLACK);
        pixels += px(12, 9, 3, 1, C_BLACK);
        pixels += px(9, 11, 4, 2, C_PINK); // Yawn
        emotionOverlay += px(17, 3, 3, 3, C_GOLD);
        break;

      case BEHAVIOR_STATES.SLEEPING:
        // Closed Eyes u u
        pixels += px(7, 10, 3, 1, C_BLACK);
        pixels += px(7, 9, 1, 1, C_BLACK);
        pixels += px(9, 9, 1, 1, C_BLACK);

        pixels += px(12, 10, 3, 1, C_BLACK);
        pixels += px(12, 9, 1, 1, C_BLACK);
        pixels += px(14, 9, 1, 1, C_BLACK);

        pixels += px(10, 11, 2, 1, C_BLACK);

        // Pixel Floating Zzz
        emotionOverlay += `
          <g class="anim-sleep">
            ${px(17, 2, 3, 1, "#a55eea")}
            ${px(19, 3, 1, 1, "#a55eea")}
            ${px(18, 4, 1, 1, "#a55eea")}
            ${px(17, 5, 3, 1, "#a55eea")}
          </g>
        `;
        break;

      case BEHAVIOR_STATES.STARTLED:
        // Shocked Big Eyes O O
        pixels += px(7, 8, 3, 3, C_BLACK);
        pixels += px(8, 9, 1, 1, C_WHITE);
        pixels += px(12, 8, 3, 3, C_BLACK);
        pixels += px(13, 9, 1, 1, C_WHITE);
        pixels += px(10, 12, 2, 2, C_BLACK);

        emotionOverlay += px(18, 5, 2, 3, C_BLUE); // Sweat drop
        break;

      case BEHAVIOR_STATES.ANGRY:
        // Slanted Angry Eyes \ /
        pixels += px(6, 8, 3, 1, C_RED);
        pixels += px(7, 9, 2, 2, C_BLACK);

        pixels += px(13, 8, 3, 1, C_RED);
        pixels += px(13, 9, 2, 2, C_BLACK);

        pixels += px(9, 12, 4, 1, C_RED);

        emotionOverlay += `
          <g class="anim-shake">
            ${px(17, 2, 3, 1, C_RED)}
            ${px(18, 1, 1, 3, C_RED)}
          </g>
        `;
        break;

      case BEHAVIOR_STATES.INDIFFERENT:
        pixels += px(8, 9, 2, 2, C_BLACK);
        pixels += px(13, 9, 2, 2, C_BLACK);
        pixels += px(10, 11, 2, 1, C_BLACK);
        break;

      default: // IDLE
        // Cute Pixel Pupil Eyes
        pixels += px(7, 9, 2, 2, C_BLACK);
        pixels += px(7, 9, 1, 1, C_WHITE);

        pixels += px(13, 9, 2, 2, C_BLACK);
        pixels += px(13, 9, 1, 1, C_WHITE);

        // Cute Cat Nose (▲) & Mouth (ω)
        pixels += px(10, 10, 2, 1, C_RED);  // Nose
        pixels += px(9, 11, 4, 1, C_BLACK); // Mouth Line
        break;
    }

    // Pixel Blush Cheeks
    pixels += px(5, 10, 2, 1, C_PINK);
    pixels += px(15, 10, 2, 1, C_PINK);

    // Pixel Cat Whiskers
    pixels += px(1, 9, 3, 1, C_BLACK);
    pixels += px(1, 11, 3, 1, C_BLACK);
    pixels += px(18, 9, 3, 1, C_BLACK);
    pixels += px(18, 11, 3, 1, C_BLACK);

    // 4. Pixel Cat Body & Paws
    pixels += px(6, 14, 10, 8, C_BLACK); // Body Outline
    pixels += px(7, 14, 8, 7, C_WHITE);  // Body White Fill

    // Front Paws
    pixels += px(4, 15, 2, 3, C_WHITE);  // Left Paw
    pixels += px(4, 15, 2, 1, C_BLACK);
    pixels += px(16, 15, 2, 3, C_WHITE); // Right Paw
    pixels += px(16, 15, 2, 1, C_BLACK);

    // Feet
    pixels += px(7, 22, 3, 3, C_WHITE);  // Left Foot
    pixels += px(7, 24, 3, 1, C_BLACK);
    pixels += px(12, 22, 3, 3, C_WHITE); // Right Foot
    pixels += px(12, 24, 3, 1, C_BLACK);

    // Curved Tail
    pixels += px(17, 17, 2, 2, C_BLACK);
    pixels += px(19, 15, 2, 2, C_BLACK);
    pixels += px(20, 13, 2, 2, C_BLACK);

    const animClass = (state === BEHAVIOR_STATES.SLEEPING) ? 'anim-sleep' :
                      (state === BEHAVIOR_STATES.ANGRY || state === BEHAVIOR_STATES.STARTLED) ? 'anim-shake' : 'anim-purr';

    return `
      <g id="catPixelGroup" class="${animClass}" shape-rendering="crispEdges">
        <!-- Shadow -->
        <rect x="20" y="115" width="70" height="8" fill="rgba(0,0,0,0.12)" />
        
        <!-- Retro Pixel Blocks -->
        ${pixels}

        <!-- Emotion Overlays -->
        ${emotionOverlay}
      </g>
    `;
  }
}
