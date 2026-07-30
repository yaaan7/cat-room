/**
 * Cat Room - High-Resolution 32x32 Pixel Art Cat Character Renderer
 * Uses a dense 32x32 pixel grid (p = 3.5) for ultra-detailed, highly expressive retro kitten artwork.
 */

import { BEHAVIOR_STATES } from '../config.js';

export class CatRenderer {
  static renderSvg(state = BEHAVIOR_STATES.IDLE) {
    const p = 3.5; // High-resolution 32x32 grid unit size

    // Helper for pixel blocks
    const px = (x, y, w = 1, h = 1, color = "#000000") => 
      `<rect x="${x * p}" y="${y * p}" width="${w * p}" height="${h * p}" fill="${color}" />`;

    // High-Res Palette
    const C_OUTLINE   = "#2d3436";
    const C_WHITE     = "#ffffff";
    const C_SHADOW    = "#fff0f5";
    const C_PINK      = "#ff7597";
    const C_LIGHT_PINK= "#ffb7c5";
    const C_DARK_PINK = "#d81b60";
    const C_EYE_BLUE  = "#70a1ff";
    const C_EYE_DARK  = "#1e90ff";
    const C_EYE_PUPIL = "#0f172a";
    const C_RED       = "#ff4757";
    const C_PURPLE    = "#a55eea";

    let pixels = "";

    // 1. High-Res Triangular Ears (Left & Right)
    // Left Ear
    pixels += px(5, 2, 5, 2, C_OUTLINE);
    pixels += px(4, 4, 7, 6, C_OUTLINE);
    pixels += px(6, 4, 3, 5, C_LIGHT_PINK); // Inner Ear
    pixels += px(7, 5, 1, 3, C_DARK_PINK);

    // Right Ear
    pixels += px(22, 2, 5, 2, C_OUTLINE);
    pixels += px(21, 4, 7, 6, C_OUTLINE);
    pixels += px(23, 4, 3, 5, C_LIGHT_PINK); // Inner Ear
    pixels += px(24, 5, 1, 3, C_DARK_PINK);

    // 2. High-Res Head Outline & Fur
    pixels += px(8, 5, 16, 2, C_OUTLINE);  // Top Head Outline
    pixels += px(3, 10, 26, 12, C_OUTLINE); // Head Main Box
    pixels += px(4, 11, 24, 10, C_WHITE);   // Face White Fill

    // Fur Shading / Fluff Cheek Tufts
    pixels += px(4, 15, 2, 4, C_SHADOW);
    pixels += px(26, 15, 2, 4, C_SHADOW);

    // Head Top Black Patch Accent
    pixels += px(5, 7, 7, 3, C_OUTLINE);
    pixels += px(20, 7, 7, 3, C_OUTLINE);

    // 3. Detailed Glistening Anime Pixel Eyes & Face
    let emotionOverlay = "";

    switch (state) {
      case BEHAVIOR_STATES.HAPPY:
        // Eye Winks ^ ^
        pixels += px(8, 14, 5, 2, C_OUTLINE);
        pixels += px(7, 15, 2, 2, C_OUTLINE);
        pixels += px(11, 15, 2, 2, C_OUTLINE);

        pixels += px(19, 14, 5, 2, C_OUTLINE);
        pixels += px(18, 15, 2, 2, C_OUTLINE);
        pixels += px(22, 15, 2, 2, C_OUTLINE);

        // Open Smile Mouth
        pixels += px(15, 17, 2, 3, C_DARK_PINK);

        // Pixel Hearts
        emotionOverlay += `
          <g class="anim-purr">
            ${px(1, 4, 4, 3, C_PINK)}
            ${px(2, 3, 2, 1, C_PINK)}
            ${px(27, 5, 4, 3, C_RED)}
            ${px(28, 4, 2, 1, C_RED)}
          </g>
        `;
        break;

      case BEHAVIOR_STATES.HUNGRY:
        // Wide Pupils
        pixels += px(8, 13, 5, 5, C_EYE_PUPIL);
        pixels += px(9, 14, 2, 2, C_WHITE);

        pixels += px(19, 13, 5, 5, C_EYE_PUPIL);
        pixels += px(20, 14, 2, 2, C_WHITE);

        // Drool
        pixels += px(15, 18, 2, 2, C_OUTLINE);
        emotionOverlay += px(16, 20, 2, 4, C_EYE_BLUE);
        break;

      case BEHAVIOR_STATES.SLEEPY:
        // Flat Lines - -
        pixels += px(8, 15, 5, 2, C_OUTLINE);
        pixels += px(19, 15, 5, 2, C_OUTLINE);
        pixels += px(14, 17, 4, 3, C_LIGHT_PINK); // Yawn
        break;

      case BEHAVIOR_STATES.SLEEPING:
        // Closed Eyes u u
        pixels += px(8, 15, 5, 2, C_OUTLINE);
        pixels += px(8, 14, 2, 2, C_OUTLINE);
        pixels += px(11, 14, 2, 2, C_OUTLINE);

        pixels += px(19, 15, 5, 2, C_OUTLINE);
        pixels += px(19, 14, 2, 2, C_OUTLINE);
        pixels += px(22, 14, 2, 2, C_OUTLINE);

        pixels += px(15, 17, 2, 1, C_OUTLINE);

        // Floating High-Res Zzz
        emotionOverlay += `
          <g class="anim-sleep">
            ${px(25, 4, 5, 2, C_PURPLE)}
            ${px(28, 6, 2, 2, C_PURPLE)}
            ${px(26, 8, 2, 2, C_PURPLE)}
            ${px(25, 10, 5, 2, C_PURPLE)}
          </g>
        `;
        break;

      case BEHAVIOR_STATES.STARTLED:
        // Shocked Eyes O O
        pixels += px(8, 13, 5, 5, C_OUTLINE);
        pixels += px(10, 15, 2, 2, C_EYE_PUPIL);

        pixels += px(19, 13, 5, 5, C_OUTLINE);
        pixels += px(21, 15, 2, 2, C_EYE_PUPIL);

        pixels += px(15, 18, 2, 3, C_OUTLINE);

        emotionOverlay += px(27, 6, 3, 5, C_EYE_BLUE); // Sweat drop
        break;

      case BEHAVIOR_STATES.ANGRY:
        // Angry Slanted Eyebrows
        pixels += px(7, 13, 6, 2, C_RED);
        pixels += px(9, 15, 3, 3, C_EYE_PUPIL);

        pixels += px(19, 13, 6, 2, C_RED);
        pixels += px(20, 15, 3, 3, C_EYE_PUPIL);

        pixels += px(14, 18, 4, 2, C_RED);

        emotionOverlay += `
          <g class="anim-shake">
            ${px(26, 4, 5, 2, C_RED)}
            ${px(28, 2, 2, 6, C_RED)}
          </g>
        `;
        break;

      case BEHAVIOR_STATES.INDIFFERENT:
        pixels += px(10, 14, 3, 3, C_EYE_PUPIL);
        pixels += px(21, 14, 3, 3, C_EYE_PUPIL);
        pixels += px(15, 17, 2, 1, C_OUTLINE);
        break;

      default: // IDLE (Detailed Anime Pixel Eyes: Iris + Highlights + Nose ▲ + Mouth ω)
        // Left Eye
        pixels += px(8, 13, 5, 5, C_OUTLINE);
        pixels += px(9, 14, 3, 3, C_EYE_BLUE);
        pixels += px(9, 14, 2, 2, C_EYE_DARK);
        pixels += px(9, 14, 1, 1, C_WHITE); // Sparkle

        // Right Eye
        pixels += px(19, 13, 5, 5, C_OUTLINE);
        pixels += px(20, 14, 3, 3, C_EYE_BLUE);
        pixels += px(20, 14, 2, 2, C_EYE_DARK);
        pixels += px(20, 14, 1, 1, C_WHITE); // Sparkle

        // Nose (▲) & Mouth (ω)
        pixels += px(15, 15, 2, 2, C_RED);       // Pink Nose
        pixels += px(13, 17, 3, 1, C_OUTLINE);   // Left mouth Q
        pixels += px(16, 17, 3, 1, C_OUTLINE);   // Right mouth Q
        break;
    }

    // High-Res Blush Cheeks
    pixels += px(5, 16, 3, 2, C_LIGHT_PINK);
    pixels += px(24, 16, 3, 2, C_LIGHT_PINK);

    // Whiskers
    pixels += px(1, 15, 4, 1, C_OUTLINE);
    pixels += px(0, 17, 4, 1, C_OUTLINE);
    pixels += px(27, 15, 4, 1, C_OUTLINE);
    pixels += px(28, 17, 4, 1, C_OUTLINE);

    // 4. Body, Chest Fluff, Paws & Tail
    pixels += px(6, 21, 20, 10, C_OUTLINE); // Body Box
    pixels += px(7, 22, 18, 8, C_WHITE);   // Body Fill

    // Fluffy Chest Tuft
    pixels += px(12, 22, 8, 5, C_SHADOW);

    // Paws & Toe Beans
    pixels += px(4, 24, 4, 5, C_WHITE);    // Left Paw
    pixels += px(4, 24, 4, 1, C_OUTLINE);
    pixels += px(5, 27, 2, 2, C_PINK);     // Toe Bean

    pixels += px(24, 24, 4, 5, C_WHITE);   // Right Paw
    pixels += px(24, 24, 4, 1, C_OUTLINE);
    pixels += px(25, 27, 2, 2, C_PINK);    // Toe Bean

    // Feet
    pixels += px(9, 29, 4, 3, C_WHITE);    // Left Foot
    pixels += px(9, 31, 4, 1, C_OUTLINE);
    pixels += px(19, 29, 4, 3, C_WHITE);   // Right Foot
    pixels += px(19, 31, 4, 1, C_OUTLINE);

    // Fluffy Pixel Tail
    pixels += px(26, 26, 4, 3, C_OUTLINE);
    pixels += px(28, 23, 4, 3, C_OUTLINE);
    pixels += px(29, 20, 3, 3, C_OUTLINE);

    const animClass = (state === BEHAVIOR_STATES.SLEEPING) ? 'anim-sleep' :
                      (state === BEHAVIOR_STATES.ANGRY || state === BEHAVIOR_STATES.STARTLED) ? 'anim-shake' : 'anim-purr';

    return `
      <g id="catHighResPixelGroup" class="${animClass}" shape-rendering="crispEdges">
        <!-- Ground Shadow -->
        <rect x="20" y="112" width="80" height="6" fill="rgba(0,0,0,0.12)" />
        
        <!-- 32x32 Dense Pixel Cat Sprite -->
        ${pixels}

        <!-- Dynamic Emotion Overlays -->
        ${emotionOverlay}
      </g>
    `;
  }
}
