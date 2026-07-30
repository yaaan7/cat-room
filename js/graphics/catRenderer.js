/**
 * Cat Room - Exact Reference Pixel Cat Character Graphic Renderer
 * Matches the user-provided 16x16 retro pixel cat reference image!
 */

import { BEHAVIOR_STATES } from '../config.js';

export class CatRenderer {
  static renderSvg(state = BEHAVIOR_STATES.IDLE) {
    const p = 8; // Pixel size (8px per pixel grid unit)

    // Helper function for pixel blocks
    const px = (x, y, w = 1, h = 1, color = "#000000") => 
      `<rect x="${x * p}" y="${y * p}" width="${w * p}" height="${h * p}" fill="${color}" />`;

    // Base Color Palette from Reference Image
    const C_OUTLINE = "#000000";     // Solid Black 1px Outline
    const C_WHITE   = "#ffffff";     // White Fur Body
    const C_EYE_BLUE= "#00a8ff";     // Glistening Blue Eye Pixel
    const C_EYE_DARK= "#2d3436";     // Dark Eye Pupil
    const C_PINK    = "#ff9ebb";     // Soft Pink Blush Cheeks
    const C_EAR_PINK = "#ffcdd2";    // Inner Ear Pink
    const C_BLUE    = "#70a1ff";     // Water / Sweat Blue
    const C_RED     = "#ff4757";     // Heart / Angry Red
    const C_PURPLE  = "#a55eea";     // Zzz Purple

    let bodyPixels = "";

    // 1. Black Outline Silhouette (16x16 Grid)
    // Left Ear Outline
    bodyPixels += px(2, 0, 3, 1, C_OUTLINE);
    bodyPixels += px(1, 1, 1, 4, C_OUTLINE);
    bodyPixels += px(4, 1, 1, 4, C_OUTLINE);

    // Right Ear Outline
    bodyPixels += px(10, 0, 3, 1, C_OUTLINE);
    bodyPixels += px(9, 1, 1, 4, C_OUTLINE);
    bodyPixels += px(12, 1, 1, 4, C_OUTLINE);

    // Head Top Outline
    bodyPixels += px(5, 2, 4, 1, C_OUTLINE);

    // Head Outer Side Outlines
    bodyPixels += px(0, 4, 1, 5, C_OUTLINE);
    bodyPixels += px(13, 4, 1, 5, C_OUTLINE);

    // Head Bottom Outline
    bodyPixels += px(1, 9, 12, 1, C_OUTLINE);

    // Body Outer Outlines
    bodyPixels += px(1, 10, 1, 5, C_OUTLINE);
    bodyPixels += px(12, 10, 1, 5, C_OUTLINE);

    // Inverted 'V' Leg Gap Outline
    bodyPixels += px(5, 12, 1, 3, C_OUTLINE);
    bodyPixels += px(8, 12, 1, 3, C_OUTLINE);
    bodyPixels += px(6, 11, 2, 1, C_OUTLINE);
    bodyPixels += px(2, 14, 10, 1, C_OUTLINE);

    // Diagonal Tail Outline (pointing up-right)
    bodyPixels += px(13, 12, 2, 1, C_OUTLINE);
    bodyPixels += px(14, 10, 2, 1, C_OUTLINE);
    bodyPixels += px(15, 8, 2, 1, C_OUTLINE);
    bodyPixels += px(16, 6, 2, 1, C_OUTLINE);
    bodyPixels += px(17, 6, 1, 3, C_OUTLINE);

    // 2. White Fur Fill
    // Inner Ears
    bodyPixels += px(2, 1, 2, 3, C_WHITE);
    bodyPixels += px(3, 2, 1, 2, C_EAR_PINK); // Inner Left Ear Pink

    bodyPixels += px(10, 1, 2, 3, C_WHITE);
    bodyPixels += px(10, 2, 1, 2, C_EAR_PINK); // Inner Right Ear Pink

    // Head Fill
    bodyPixels += px(1, 4, 12, 5, C_WHITE);

    // Body & Legs Fill
    bodyPixels += px(2, 10, 10, 4, C_WHITE);
    bodyPixels += px(13, 11, 2, 2, C_WHITE); // Tail Fill Base
    bodyPixels += px(15, 9, 2, 2, C_WHITE);  // Tail Fill Tip

    // 3. Facial Features & Expressions per State
    let emotionOverlay = "";

    switch (state) {
      case BEHAVIOR_STATES.HAPPY:
        // Eye Winks ^ ^
        bodyPixels += px(3, 5, 2, 1, C_OUTLINE);
        bodyPixels += px(9, 5, 2, 1, C_OUTLINE);

        // Open Smile Mouth
        bodyPixels += px(6, 7, 2, 1, C_PINK);

        // Floating Pixel Hearts
        emotionOverlay += `
          <g class="anim-purr">
            ${px(0, 1, 2, 2, C_PINK)}
            ${px(15, 2, 2, 2, C_RED)}
          </g>
        `;
        break;

      case BEHAVIOR_STATES.HUNGRY:
        // Big Black Eyes
        bodyPixels += px(3, 5, 2, 2, C_EYE_DARK);
        bodyPixels += px(3, 5, 1, 1, C_WHITE);

        bodyPixels += px(9, 5, 2, 2, C_EYE_DARK);
        bodyPixels += px(9, 5, 1, 1, C_WHITE);

        // Mouth & Drool
        bodyPixels += px(6, 7, 2, 1, C_OUTLINE);
        emotionOverlay += px(7, 8, 1, 2, C_BLUE);
        break;

      case BEHAVIOR_STATES.SLEEPY:
        // Flat Eyes - -
        bodyPixels += px(3, 6, 2, 1, C_OUTLINE);
        bodyPixels += px(9, 6, 2, 1, C_OUTLINE);
        bodyPixels += px(6, 7, 2, 1, C_PINK); // Yawn
        break;

      case BEHAVIOR_STATES.SLEEPING:
        // Closed Eyes u u
        bodyPixels += px(3, 6, 2, 1, C_OUTLINE);
        bodyPixels += px(9, 6, 2, 1, C_OUTLINE);
        bodyPixels += px(6, 7, 2, 1, C_OUTLINE);

        // Floating Zzz
        emotionOverlay += `
          <g class="anim-sleep">
            ${px(14, 2, 3, 1, C_PURPLE)}
            ${px(16, 3, 1, 1, C_PURPLE)}
            ${px(15, 4, 1, 1, C_PURPLE)}
            ${px(14, 5, 3, 1, C_PURPLE)}
          </g>
        `;
        break;

      case BEHAVIOR_STATES.STARTLED:
        // Shocked Eyes
        bodyPixels += px(3, 5, 2, 2, C_OUTLINE);
        bodyPixels += px(4, 5, 1, 1, C_WHITE);

        bodyPixels += px(9, 5, 2, 2, C_OUTLINE);
        bodyPixels += px(10, 5, 1, 1, C_WHITE);

        bodyPixels += px(6, 7, 2, 1, C_OUTLINE);

        emotionOverlay += px(14, 3, 2, 3, C_BLUE); // Sweat drop
        break;

      case BEHAVIOR_STATES.ANGRY:
        // Slanted Angry Eyes
        bodyPixels += px(3, 5, 2, 1, C_RED);
        bodyPixels += px(9, 5, 2, 1, C_RED);
        bodyPixels += px(6, 7, 2, 1, C_RED);

        emotionOverlay += `
          <g class="anim-shake">
            ${px(14, 2, 3, 1, C_RED)}
            ${px(15, 1, 1, 3, C_RED)}
          </g>
        `;
        break;

      case BEHAVIOR_STATES.INDIFFERENT:
        bodyPixels += px(4, 6, 1, 1, C_OUTLINE);
        bodyPixels += px(10, 6, 1, 1, C_OUTLINE);
        bodyPixels += px(6, 7, 2, 1, C_OUTLINE);
        break;

      default: // IDLE (Exact Reference Image Eyes: Glistening Blue Dots + Nose Dot + Pink Blush)
        bodyPixels += px(3, 6, 1, 1, C_EYE_BLUE);  // Left Blue Eye Pixel
        bodyPixels += px(10, 6, 1, 1, C_EYE_BLUE); // Right Blue Eye Pixel
        bodyPixels += px(6, 6, 1, 1, C_OUTLINE);   // Center Nose Pixel Dot
        break;
    }

    // Soft Pink Blush Cheeks (Exact match to reference image!)
    bodyPixels += px(2, 7, 2, 1, C_PINK);
    bodyPixels += px(10, 7, 2, 1, C_PINK);

    const animClass = (state === BEHAVIOR_STATES.SLEEPING) ? 'anim-sleep' :
                      (state === BEHAVIOR_STATES.ANGRY || state === BEHAVIOR_STATES.STARTLED) ? 'anim-shake' : 'anim-purr';

    return `
      <g id="catExactPixelGroup" class="${animClass}" shape-rendering="crispEdges">
        <!-- Shadow -->
        <rect x="8" y="118" width="96" height="8" fill="rgba(0,0,0,0.12)" />
        
        <!-- Exact Reference Image Pixel Cat Sprite -->
        ${bodyPixels}

        <!-- Dynamic Emotion Overlays -->
        ${emotionOverlay}
      </g>
    `;
  }
}
