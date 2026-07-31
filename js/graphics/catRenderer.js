/**
 * Cat Room - Nabi Pixel Cat Renderer (Cute Pink/Peach Style)
 *
 * p = 3  (fine pixel grid)
 * Grid: ~32w × 30h = 96×90 SVG px
 *
 * Design reference: 케이탄 pixel cat — pink/peach body, round shape,
 * dark outline, inner ear pink, cute face with blush.
 *
 * MODULAR: shared headBlock/bodyBlock/tailBlock for consistent form.
 * Only face expression + overlays change per state.
 */

import { BEHAVIOR_STATES } from '../config.js';

export class CatRenderer {
  static renderSvg(state = BEHAVIOR_STATES.IDLE) {
    const p = 3;
    const px = (x, y, w = 1, h = 1, c = '#000') =>
      `<rect x="${x*p}" y="${y*p}" width="${w*p}" height="${h*p}" fill="${c}" shape-rendering="crispEdges"/>`;

    // ── Palette (pink/peach cat) ──
    const O  = '#5c3a2e';   // dark brown outline
    const S  = '#e8a090';   // peach skin (body)
    const SH = '#d48878';   // darker shade
    const HL = '#f0c0b0';   // highlight
    const EP = '#e06080';   // ear inner / nose pink
    const W  = '#fef0e8';   // white (face, belly)
    const PK = '#f06888';   // blush / hearts
    const BK = '#3a2218';   // pupils
    const RD = '#e84060';   // tongue / mouth
    const ZZ = '#9060c0';   // zzz
    const GD = '#f8c858';   // sparkle gold
    const HD = '#ffe0c0';   // hand skin

    // ╔════════════════════════════════════════════════════════════╗
    // ║  SHARED BLOCKS — same in every standing pose              ║
    // ╚════════════════════════════════════════════════════════════╝

    // HEAD — ears + face. ~24w × 16h, centered at x=4
    const headBlock = `
      <!-- left ear -->
      ${px(6,0,3,1,O)} ${px(5,1,5,1,O)} ${px(4,2,7,1,O)} ${px(4,3,7,1,O)}
      ${px(6,1,2,1,S)} ${px(5,2,5,1,S)} ${px(5,3,5,1,S)}
      ${px(6,2,2,1,EP)} ${px(6,3,2,1,EP)}
      <!-- right ear -->
      ${px(21,0,3,1,O)} ${px(20,1,5,1,O)} ${px(19,2,7,1,O)} ${px(19,3,7,1,O)}
      ${px(22,1,2,1,S)} ${px(20,2,5,1,S)} ${px(20,3,5,1,S)}
      ${px(22,2,2,1,EP)} ${px(22,3,2,1,EP)}
      <!-- head top outline -->
      ${px(7,4,16,1,O)}
      <!-- head sides -->
      ${px(3,5,1,10,O)} ${px(26,5,1,10,O)}
      <!-- head fill rows -->
      ${px(4,4,3,1,O)} ${px(23,4,3,1,O)}
      ${px(4,5,22,1,S)} ${px(4,6,22,1,S)} ${px(4,7,22,9,S)}
      <!-- face white patch (cheeks + muzzle) -->
      ${px(6,8,18,6,W)}
      <!-- head highlight -->
      ${px(5,5,4,2,HL)}
      <!-- head bottom -->
      ${px(3,15,24,1,O)}
      <!-- neck transition -->
      ${px(6,15,18,1,S)}
    `;

    // BODY — rounded torso + legs. ~26w × 14h
    const bodyBlock = `
      <!-- body outline -->
      ${px(3,16,24,1,O)}
      ${px(2,17,1,8,O)} ${px(27,17,1,8,O)}
      <!-- body fill -->
      ${px(3,17,24,7,S)}
      <!-- belly white patch -->
      ${px(8,18,14,5,W)}
      <!-- body shade at bottom -->
      ${px(3,23,24,1,SH)}
      <!-- leg separation -->
      ${px(2,24,7,1,O)} ${px(21,24,7,1,O)}
      ${px(9,24,1,1,O)} ${px(20,24,1,1,O)}
      <!-- left leg -->
      ${px(2,25,1,3,O)} ${px(8,25,1,3,O)}
      ${px(2,28,7,1,O)}
      ${px(3,25,5,3,S)} ${px(3,27,5,1,SH)}
      <!-- paw pads -->
      ${px(4,27,2,1,EP)}
      <!-- right leg -->
      ${px(21,25,1,3,O)} ${px(27,25,1,3,O)}
      ${px(21,28,7,1,O)}
      ${px(22,25,5,3,S)} ${px(22,27,5,1,SH)}
      ${px(23,27,2,1,EP)}
      <!-- gap between legs -->
      ${px(10,24,10,1,O)}
    `;

    // TAIL — curvy going right
    const tailBlock = `
      ${px(27,20,2,1,O)} ${px(28,19,2,1,O)} ${px(29,18,2,1,O)}
      ${px(30,17,2,1,O)} ${px(31,16,2,1,O)} ${px(31,15,2,2,O)}
      ${px(28,20,1,1,S)} ${px(29,19,1,1,S)} ${px(30,18,1,1,S)}
      ${px(31,17,1,1,S)} ${px(31,16,1,1,S)}
    `;

    // Stripe marks on body (cat tiger markings)
    const stripeBlock = `
      ${px(8,5,2,2,SH)} ${px(20,5,2,2,SH)}
      ${px(5,17,2,3,SH)} ${px(23,17,2,3,SH)}
    `;

    const standingCat = headBlock + bodyBlock + tailBlock + stripeBlock;

    // ╔════════════════════════════════════════════════════════════╗
    // ║  PER-POSE: face + overlays only                           ║
    // ╚════════════════════════════════════════════════════════════╝
    let catBody = '';
    let face = '';
    let overlay = '';
    let anim = 'anim-purr';

    // ── SLEEPING ─────────────────────────────────────────────
    if (state === BEHAVIOR_STATES.SLEEPING || state === BEHAVIOR_STATES.SLEEPY) {
      anim = 'anim-sleep';
      // Same head, curled oval body
      catBody = `
        ${headBlock}
        <!-- curled body -->
        ${px(3,16,24,1,O)}
        ${px(1,17,28,1,O)}
        ${px(0,18,30,6,O)}
        ${px(1,24,28,1,O)}
        ${px(3,25,24,1,O)}
        ${px(2,17,26,1,S)} ${px(1,18,28,6,S)} ${px(2,24,26,1,S)}
        ${px(6,19,18,4,W)}
        <!-- wrapped tail -->
        ${px(26,20,4,2,O)} ${px(28,18,2,2,O)}
        ${px(27,21,2,1,S)} ${px(28,19,1,1,S)}
        ${stripeBlock}
      `;
      // Closed U-eyes + blush
      face = `
        ${px(8,9,2,1,O)} ${px(9,10,1,1,O)} ${px(10,9,1,1,O)}
        ${px(19,9,1,1,O)} ${px(20,10,1,1,O)} ${px(21,9,2,1,O)}
        ${px(6,11,3,1,PK)} ${px(21,11,3,1,PK)}
        ${px(13,12,4,1,EP)}
      `;
      // Floating Zzz
      overlay = `
        <g class="anim-sleep">
          ${px(28,-2,4,1,ZZ)} ${px(31,-1,1,1,ZZ)} ${px(30,0,1,1,ZZ)} ${px(28,1,4,1,ZZ)}
          ${px(32,-4,3,1,ZZ)} ${px(34,-3,1,1,ZZ)} ${px(32,-2,3,1,ZZ)}
        </g>`;
    }

    // ── EATING (HUNGRY) ──────────────────────────────────────
    else if (state === BEHAVIOR_STATES.HUNGRY) {
      anim = 'anim-purr';
      catBody = standingCat;
      // ^ closed eyes + open mouth + blush
      face = `
        ${px(8,9,4,1,O)} ${px(19,9,4,1,O)}
        ${px(12,12,6,2,RD)}
        ${px(6,11,3,1,PK)} ${px(21,11,3,1,PK)}
      `;
      overlay = `<g class="anim-purr">${px(30,10,2,2,GD)} ${px(32,13,1,1,GD)}</g>`;
    }

    // ── PLAYING (HAPPY) ──────────────────────────────────────
    else if (state === BEHAVIOR_STATES.HAPPY) {
      anim = 'anim-play';
      catBody = standingCat;
      // ^ happy eyes + wide smile
      face = `
        ${px(8,9,4,1,O)} ${px(19,9,4,1,O)}
        ${px(10,12,10,1,RD)}
        ${px(6,11,3,1,PK)} ${px(21,11,3,1,PK)}
      `;
      overlay = `<g class="anim-play">${px(30,2,3,3,GD)} ${px(-1,2,3,3,PK)}</g>`;
    }

    // ── PETTING (ANGRY state = petting reaction) ─────────────
    else if (state === BEHAVIOR_STATES.ANGRY) {
      anim = 'anim-purr';
      catBody = standingCat;
      // Blissful closed eyes + gentle smile + deep blush
      face = `
        ${px(8,9,4,1,O)} ${px(19,9,4,1,O)}
        ${px(12,13,6,1,O)}
        ${px(6,11,4,2,PK)} ${px(20,11,4,2,PK)}
      `;
      overlay = `
        <g class="anim-purr">
          ${px(18,-3,8,3,HD)} ${px(22,-5,6,3,HD)}
          ${px(28,0,4,4,PK)}
        </g>`;
    }

    // ── STARTLED ─────────────────────────────────────────────
    else if (state === BEHAVIOR_STATES.STARTLED) {
      anim = 'anim-shake';
      catBody = standingCat;
      // Wide eyes + open mouth
      face = `
        ${px(8,8,3,3,BK)} ${px(20,8,3,3,BK)}
        ${px(9,9,1,1,W)}  ${px(21,9,1,1,W)}
        ${px(12,12,6,2,O)}
      `;
      overlay = `<g class="anim-shake">${px(28,2,3,1,RD)} ${px(29,4,2,1,RD)}</g>`;
    }

    // ── IDLE (default) ───────────────────────────────────────
    else {
      anim = 'anim-purr';
      catBody = standingCat;
      // Round open eyes + triangle nose + 'w' mouth + blush
      face = `
        <!-- eyes -->
        ${px(8,8,3,3,BK)} ${px(20,8,3,3,BK)}
        ${px(9,9,1,1,W)}  ${px(21,9,1,1,W)}
        <!-- nose -->
        ${px(14,11,2,1,EP)}
        <!-- w mouth -->
        ${px(12,12,2,1,O)} ${px(16,12,2,1,O)} ${px(14,13,2,1,O)}
        <!-- blush -->
        ${px(6,11,3,1,PK)} ${px(21,11,3,1,PK)}
      `;
    }

    // Shadow
    const shCx = 15 * p, shCy = 29 * p;

    return `
<g id="catNabi" class="${anim}" shape-rendering="crispEdges">
  <ellipse cx="${shCx}" cy="${shCy}" rx="${12*p}" ry="${2*p}" fill="rgba(0,0,0,0.06)"/>
  ${catBody}
  ${face}
  ${overlay}
</g>`;
  }
}
