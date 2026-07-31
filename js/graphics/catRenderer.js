/**
 * Cat Room - Nabi Pixel Cat Renderer (Modular & Consistent)
 *
 * p = 4  (finer pixel grid for smoother, consistent proportions)
 * Grid: ~24w × 24h  = 96×96 SVG px
 *
 * KEY DESIGN: head, body, and tail are drawn by SHARED helper blocks,
 * guaranteeing 100% identical form across all standing poses.
 * Only face expression + overlays change per state.
 * Sleeping uses the same head shape but a curled body.
 */

import { BEHAVIOR_STATES } from '../config.js';

export class CatRenderer {
  static renderSvg(state = BEHAVIOR_STATES.IDLE) {
    const p = 4;
    const px = (x, y, w = 1, h = 1, c = '#000') =>
      `<rect x="${x*p}" y="${y*p}" width="${w*p}" height="${h*p}" fill="${c}" shape-rendering="crispEdges"/>`;

    // Palette
    const O  = '#333333';   // outline
    const W  = '#ffffff';   // white fur
    const EP = '#ffcdd2';   // ear inner pink
    const PK = '#ff7597';   // blush / hearts
    const RD = '#ff4757';   // mouth / tongue
    const ZZ = '#a55eea';   // zzz
    const GD = '#ffbe76';   // gold sparkle
    const HD = '#ffe0b2';   // human hand skin

    // ╔════════════════════════════════════════════════════════════╗
    // ║  SHARED BLOCKS — identical in EVERY pose (except sleep)  ║
    // ╚════════════════════════════════════════════════════════════╝

    // HEAD (ears + face box)  — origin-relative
    // Ears span y=0..2, head box y=3..11.  Width x=2..17 (16px).
    const headBlock = `
      <!-- left ear -->
      ${px(5,0,2,1,O)} ${px(4,1,4,1,O)} ${px(3,2,6,1,O)}
      ${px(5,1,2,1,W)} ${px(4,2,4,1,W)} ${px(5,2,2,1,EP)}
      <!-- right ear -->
      ${px(14,0,2,1,O)} ${px(13,1,4,1,O)} ${px(12,2,6,1,O)}
      ${px(14,1,2,1,W)} ${px(13,2,4,1,W)} ${px(14,2,2,1,EP)}
      <!-- head box outline -->
      ${px(3,3,14,1,O)}
      ${px(2,4,1,7,O)} ${px(17,4,1,7,O)}
      ${px(3,11,14,1,O)}
      <!-- head fill -->
      ${px(3,4,14,7,W)}
    `;

    // BODY + LEGS  — top at y=12, feet at y=22.  Width x=0..19 (20px).
    // Two rectangular legs with clean gap between them.
    const bodyBlock = `
      <!-- body box -->
      ${px(1,12,18,1,O)}
      ${px(0,13,1,5,O)} ${px(19,13,1,5,O)}
      ${px(1,13,18,5,W)}
      <!-- bottom edge above leg gap -->
      ${px(6,17,8,1,O)}
      <!-- left leg -->
      ${px(0,18,6,1,O)}
      ${px(0,19,1,3,O)} ${px(5,19,1,3,O)}
      ${px(0,22,6,1,O)}
      ${px(1,19,4,3,W)}
      <!-- right leg -->
      ${px(14,18,6,1,O)}
      ${px(14,19,1,3,O)} ${px(19,19,1,3,O)}
      ${px(14,22,6,1,O)}
      ${px(15,19,4,3,W)}
    `;

    // TAIL — diagonal from body-right going up-right
    // Starts at (19,16), tip at (22,10)
    const tailBlock = `
      ${px(19,16,2,1,O)} ${px(20,14,2,1,O)}
      ${px(21,12,2,1,O)} ${px(22,10,2,1,O)}
      ${px(22,10,1,3,O)}
      ${px(20,15,1,1,W)} ${px(21,13,1,1,W)} ${px(22,11,1,1,W)}
    `;

    // Full standing cat (used by ALL non-sleeping poses)
    const standingCat = headBlock + bodyBlock + tailBlock;

    // ╔════════════════════════════════════════════════════════════╗
    // ║  PER-POSE: only face expression + overlay effects differ ║
    // ╚════════════════════════════════════════════════════════════╝

    let catBody = '';
    let face = '';
    let overlay = '';
    let anim = 'anim-purr';

    // ── SLEEPING ─────────────────────────────────────────────────
    if (state === BEHAVIOR_STATES.SLEEPING || state === BEHAVIOR_STATES.SLEEPY) {
      anim = 'anim-sleep';

      // Same head shape, but curled oval body instead of standing
      catBody = `
        ${headBlock}
        <!-- curled body oval -->
        ${px(2,12,16,1,O)}
        ${px(1,13,18,1,O)}
        ${px(0,14,20,4,O)}
        ${px(1,18,18,1,O)}
        ${px(2,19,16,1,O)}
        ${px(2,13,16,1,W)}
        ${px(1,14,18,4,W)}
        ${px(2,18,16,1,W)}
        <!-- wrapped tail -->
        ${px(18,14,4,1,O)} ${px(20,12,2,2,O)}
        ${px(19,15,2,1,W)} ${px(20,13,1,1,W)}
      `;

      // Closed U-shaped eyes
      face = `
        ${px(5,6,1,1,O)} ${px(6,7,1,1,O)} ${px(7,6,1,1,O)}
        ${px(12,6,1,1,O)} ${px(13,7,1,1,O)} ${px(14,6,1,1,O)}
        <!-- blush -->
        ${px(4,8,2,1,PK)} ${px(15,8,2,1,PK)}
      `;

      // Floating Zzz
      overlay = `
        <g class="anim-sleep">
          ${px(22,-1,3,1,ZZ)} ${px(24,0,1,1,ZZ)} ${px(23,1,1,1,ZZ)} ${px(22,2,3,1,ZZ)}
          ${px(25,-4,2,1,ZZ)} ${px(26,-3,1,1,ZZ)} ${px(25,-2,2,1,ZZ)}
        </g>
      `;
    }

    // ── EATING (HUNGRY) ──────────────────────────────────────────
    else if (state === BEHAVIOR_STATES.HUNGRY) {
      anim = 'anim-purr';
      catBody = standingCat;

      // Closed ^ eyes (munching) + open mouth
      face = `
        ${px(5,5,3,1,O)} ${px(12,5,3,1,O)}
        ${px(8,8,4,1,RD)}
        ${px(4,7,2,1,PK)} ${px(15,7,2,1,PK)}
      `;

      // Food crumbs
      overlay = `<g class="anim-purr">${px(22,8,1,1,GD)} ${px(24,10,1,1,GD)} ${px(21,11,1,1,GD)}</g>`;
    }

    // ── PLAYING (HAPPY) ──────────────────────────────────────────
    else if (state === BEHAVIOR_STATES.HAPPY) {
      anim = 'anim-play';
      catBody = standingCat;

      // Happy ^ eyes + wide smile
      face = `
        ${px(5,5,3,1,O)} ${px(12,5,3,1,O)}
        ${px(7,8,6,1,RD)}
        ${px(4,7,2,1,PK)} ${px(15,7,2,1,PK)}
      `;

      // Sparkles
      overlay = `<g class="anim-play">${px(22,0,2,2,GD)} ${px(-1,0,2,2,PK)}</g>`;
    }

    // ── PETTING (ANGRY state used for petting) ───────────────────
    else if (state === BEHAVIOR_STATES.ANGRY) {
      anim = 'anim-purr';
      catBody = standingCat;

      // Blissful closed eyes + gentle smile
      face = `
        ${px(5,5,3,1,O)} ${px(12,5,3,1,O)}
        ${px(8,9,4,1,O)}
        ${px(4,7,2,1,PK)} ${px(15,7,2,1,PK)}
      `;

      // Petting hand + floating heart
      overlay = `
        <g class="anim-purr">
          ${px(12,-2,8,2,HD)} ${px(14,-4,6,3,HD)}
          ${px(21,1,3,3,PK)}
        </g>
      `;
    }

    // ── STARTLED ─────────────────────────────────────────────────
    else if (state === BEHAVIOR_STATES.STARTLED) {
      anim = 'anim-shake';
      catBody = standingCat;

      // Wide-open scared eyes + open mouth
      face = `
        ${px(5,5,2,2,O)} ${px(13,5,2,2,O)}
        ${px(8,8,4,2,O)}
      `;

      // Exclamation marks
      overlay = `<g class="anim-shake">${px(21,1,2,1,'#ff4757')} ${px(22,3,1,1,'#ff4757')}</g>`;
    }

    // ── IDLE (default) ───────────────────────────────────────────
    else {
      anim = 'anim-purr';
      catBody = standingCat;

      // Open dot eyes + 'w' mouth + soft blush
      face = `
        ${px(6,6,2,1,O)} ${px(13,6,2,1,O)}
        ${px(8,8,4,1,O)}
        ${px(4,7,2,1,PK)} ${px(15,7,2,1,PK)}
      `;
    }

    // Floor shadow
    const shCx = 10 * p, shCy = 23 * p;

    return `
<g id="catNabi" class="${anim}" shape-rendering="crispEdges">
  <ellipse cx="${shCx}" cy="${shCy}" rx="${9*p}" ry="${1.5*p}" fill="rgba(0,0,0,0.08)"/>
  ${catBody}
  ${face}
  ${overlay}
</g>`;
  }
}
