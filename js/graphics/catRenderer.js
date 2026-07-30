/**
 * Cat Room - Retro Pixel-Art SVG Cat Character Graphic Renderer
 * Inspired by classic 16-bit / 8-bit Tamagotchi pixel sprites.
 */

import { BEHAVIOR_STATES } from '../config.js';

export class CatRenderer {
  static renderSvg(state = BEHAVIOR_STATES.IDLE) {
    const p = 4; // Pixel unit size (4px per pixel block)

    // Helper to draw pixel rectangles
    const px = (x, y, w, h, color) => `<rect x="${x * p}" y="${y * p}" width="${w * p}" height="${h * p}" fill="${color}" />`;

    // Base Colors
    const C_BLACK = "#2d3436";
    const C_WHITE = "#ffffff";
    const C_PINK = "#ff7597";
    const C_LIGHT_PINK = "#ffb7c5";
    const C_BLUE = "#70a1ff";
    const C_RED = "#ff4757";

    // Common Body Pixel Structure (Bipedal Cute Standing Cat)
    let pixels = "";

    // 1. Black Ears & Head Patches
    pixels += px(6, 2, 4, 3, C_BLACK);   // Left Ear Tip
    pixels += px(5, 3, 6, 4, C_BLACK);
    pixels += px(7, 4, 2, 2, C_LIGHT_PINK); // Inner Ear

    pixels += px(14, 2, 4, 3, C_BLACK);  // Right Ear Tip
    pixels += px(13, 3, 6, 4, C_BLACK);
    pixels += px(15, 4, 2, 2, C_LIGHT_PINK); // Inner Ear

    // Head Base Outline & Fill
    pixels += px(5, 7, 14, 8, C_BLACK);  // Head Outer Border
    pixels += px(6, 8, 12, 6, C_WHITE);  // Head White Face Fill

    // Black Head Patch Top
    pixels += px(6, 7, 4, 2, C_BLACK);
    pixels += px(14, 7, 4, 2, C_BLACK);

    // 2. Eyes & Facial Expression per State
    let emotionOverlay = "";

    switch (state) {
      case BEHAVIOR_STATES.HAPPY:
        // Eye Winks ^ ^
        pixels += px(8, 10, 3, 1, C_BLACK);
        pixels += px(7, 11, 1, 1, C_BLACK);
        pixels += px(9, 11, 1, 1, C_BLACK);

        pixels += px(13, 10, 3, 1, C_BLACK);
        pixels += px(12, 11, 1, 1, C_BLACK);
        pixels += px(14, 11, 1, 1, C_BLACK);

        // Open Smile Mouth
        pixels += px(11, 12, 2, 2, C_PINK);

        // Pixel Hearts
        emotionOverlay += `
          <g class="anim-purr">
            ${px(2, 4, 2, 2, C_PINK)}
            ${px(1, 3, 1, 1, C_PINK)}
            ${px(3, 3, 1, 1, C_PINK)}
            ${px(20, 5, 2, 2, C_RED)}
          </g>
        `;
        break;

      case BEHAVIOR_STATES.HUNGRY:
        // Big Wide Eyes
        pixels += px(8, 9, 3, 3, C_BLACK);
        pixels += px(8, 9, 1, 1, C_WHITE);
        pixels += px(13, 9, 3, 3, C_BLACK);
        pixels += px(13, 9, 1, 1, C_WHITE);

        // Open Mouth with Drool
        pixels += px(11, 13, 2, 1, C_BLACK);
        emotionOverlay += px(12, 14, 1, 2, C_BLUE); // Drool
        break;

      case BEHAVIOR_STATES.SLEEPY:
        // Flat Lines - -
        pixels += px(8, 10, 3, 1, C_BLACK);
        pixels += px(13, 10, 3, 1, C_BLACK);
        pixels += px(10, 12, 4, 2, C_PINK); // Yawn
        emotionOverlay += px(18, 4, 3, 3, "#ffbe76"); // Yawn indicator
        break;

      case BEHAVIOR_STATES.SLEEPING:
        // Sleeping Closed Eyes u u
        pixels += px(8, 11, 3, 1, C_BLACK);
        pixels += px(8, 10, 1, 1, C_BLACK);
        pixels += px(10, 10, 1, 1, C_BLACK);

        pixels += px(13, 11, 3, 1, C_BLACK);
        pixels += px(13, 10, 1, 1, C_BLACK);
        pixels += px(15, 10, 1, 1, C_BLACK);

        pixels += px(11, 12, 2, 1, C_BLACK);

        // Floating Pixel Zzz
        emotionOverlay += `
          <g class="anim-sleep">
            ${px(17, 3, 3, 1, "#a55eea")}
            ${px(19, 4, 1, 1, "#a55eea")}
            ${px(18, 5, 1, 1, "#a55eea")}
            ${px(17, 6, 3, 1, "#a55eea")}
          </g>
        `;
        break;

      case BEHAVIOR_STATES.STARTLED:
        // Shocked Pixel Eyes O O
        pixels += px(8, 9, 3, 3, C_BLACK);
        pixels += px(9, 10, 1, 1, C_WHITE);
        pixels += px(13, 9, 3, 3, C_BLACK);
        pixels += px(14, 10, 1, 1, C_WHITE);
        pixels += px(11, 13, 2, 2, C_BLACK);

        // Pixel Sweat Drop
        emotionOverlay += px(19, 6, 2, 3, C_BLUE);
        break;

      case BEHAVIOR_STATES.ANGRY:
        // Slanted Angry Eyes \ /
        pixels += px(7, 9, 3, 1, C_RED);
        pixels += px(8, 10, 2, 2, C_BLACK);

        pixels += px(14, 9, 3, 1, C_RED);
        pixels += px(14, 10, 2, 2, C_BLACK);

        pixels += px(10, 13, 4, 1, C_RED);

        // Pixel Anger Mark
        emotionOverlay += `
          <g class="anim-shake">
            ${px(18, 3, 3, 1, C_RED)}
            ${px(19, 2, 1, 3, C_RED)}
          </g>
        `;
        break;

      case BEHAVIOR_STATES.INDIFFERENT:
        // Looking Side Eyes . .
        pixels += px(9, 10, 2, 2, C_BLACK);
        pixels += px(14, 10, 2, 2, C_BLACK);
        pixels += px(11, 12, 2, 1, C_BLACK);
        break;

      default: // IDLE
        // Normal Cute Pixel Eyes
        pixels += px(8, 10, 2, 2, C_BLACK);
        pixels += px(8, 10, 1, 1, C_WHITE);

        pixels += px(14, 10, 2, 2, C_BLACK);
        pixels += px(14, 10, 1, 1, C_WHITE);

        pixels += px(11, 12, 2, 1, C_BLACK);
        break;
    }

    // Blush Cheeks (Pixel Pink)
    pixels += px(6, 11, 2, 1, C_PINK);
    pixels += px(16, 11, 2, 1, C_PINK);

    // 3. Body & Paws
    pixels += px(7, 15, 10, 8, C_BLACK);  // Body Outer Border
    pixels += px(8, 15, 8, 7, C_WHITE);   // Body White Fill

    // Arms Paws
    pixels += px(5, 16, 2, 3, C_WHITE);   // Left Arm Paw
    pixels += px(5, 16, 2, 1, C_BLACK);
    pixels += px(17, 16, 2, 3, C_WHITE);  // Right Arm Paw
    pixels += px(17, 16, 2, 1, C_BLACK);

    // Legs Feet
    pixels += px(8, 22, 3, 3, C_WHITE);   // Left Foot
    pixels += px(8, 24, 3, 1, C_BLACK);
    pixels += px(13, 22, 3, 3, C_WHITE);  // Right Foot
    pixels += px(13, 24, 3, 1, C_BLACK);

    // Tail (Pixel Curved)
    pixels += px(18, 18, 2, 2, C_BLACK);
    pixels += px(20, 16, 2, 2, C_BLACK);
    pixels += px(21, 14, 2, 2, C_BLACK);

    const animClass = (state === BEHAVIOR_STATES.SLEEPING) ? 'anim-sleep' :
                      (state === BEHAVIOR_STATES.ANGRY || state === BEHAVIOR_STATES.STARTLED) ? 'anim-shake' : 'anim-purr';

    return `
      <g id="catPixelGroup" class="${animClass}" shape-rendering="crispEdges">
        <!-- Pixel Shadow -->
        <rect x="24" y="96" width="48" height="8" fill="rgba(0,0,0,0.15)" />
        
        <!-- Cat Sprite Pixel Blocks -->
        ${pixels}

        <!-- Dynamic Emotion Overlay -->
        ${emotionOverlay}
      </g>
    `;
  }
}
