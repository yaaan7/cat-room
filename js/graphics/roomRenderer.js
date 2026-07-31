/**
 * Cat Room - High-Quality Pixel Art Room Renderer
 *
 * SVG viewBox: 440 × 330   grid: 176 × 132 @ p=2.5
 * FLOOR_Y = 74  (wall 56%, floor 44% — extra floor room)
 *
 * Reference: NABI MEOW asset sheet — cute, shaded, multi-color pixel items.
 */

import { BEHAVIOR_STATES } from '../config.js';

export class RoomRenderer {
  static renderRoomSvg(slotsData = {}, catSvgContent = '', catState = BEHAVIOR_STATES.IDLE) {
    const wp       = slotsData.wallpaper || 'wp_beige';
    const fl       = slotsData.floor     || 'fl_wood';
    const bedSlot  = slotsData.bed       || 'bed_cushion';
    const bowlSlot = slotsData.bowl      || 'bowl_plastic';
    const towerSlot= slotsData.catTower  || 'tower_mini';
    const cushSlot = slotsData.cushion   || 'cushion_default';
    const toySlot  = slotsData.toy       || 'toy_yarn';
    const winSlot  = slotsData.window    || 'win_day';
    const decorSlot= slotsData.wallDecor || 'wall_frame';

    const p = 2.5;
    const px = (x, y, w = 1, h = 1, c = '#000') =>
      `<rect x="${x*p}" y="${y*p}" width="${w*p}" height="${h*p}" fill="${c}" shape-rendering="crispEdges"/>`;
    const FY = 74; // floor divider

    // ═══════════════════════════════════════════════════════════════
    // 1. WALLPAPER
    // ═══════════════════════════════════════════════════════════════
    let wC1 = '#fff3f0', wC2 = '#ffd6d6', wC3 = '#ffecec';
    if (wp === 'wp_pink') { wC1 = '#fce4ec'; wC2 = '#f8bbd0'; wC3 = '#ffd1dc'; }
    if (wp === 'wp_gray') { wC1 = '#f5f5f5'; wC2 = '#e0e0e0'; wC3 = '#eeeeee'; }
    let wall = px(0, 0, 176, FY, wC1);
    // gentle diamond lattice pattern
    for (let gx = 0; gx < 176; gx += 10)
      for (let gy = 0; gy < FY; gy += 10) {
        const off = (gy / 10) % 2 === 0 ? 0 : 5;
        wall += px(gx + off + 4, gy + 4, 2, 2, wC2);
      }

    // ═══════════════════════════════════════════════════════════════
    // 2. FLOOR
    // ═══════════════════════════════════════════════════════════════
    let fC1 = '#ffe4c4', fC2 = '#f5d4a8', fC3 = '#e8c490', fC4 = '#c8a470';
    if (fl === 'fl_rug')  { fC1 = '#e0f2f1'; fC2 = '#b2dfdb'; fC3 = '#80cbc4'; fC4 = '#4db6ac'; }
    if (fl === 'fl_tile') { fC1 = '#fafafa'; fC2 = '#f0f0f0'; fC3 = '#e0e0e0'; fC4 = '#bdbdbd'; }
    const FH = 132 - FY;
    let floor = px(0, FY, 176, FH, fC1);
    // baseboard with shadow
    floor += px(0, FY, 176, 1, fC4);
    floor += px(0, FY + 1, 176, 2, fC3);
    // plank lines
    for (let gx = 0; gx < 176; gx += 18)
      floor += px(gx, FY + 3, 1, FH - 3, fC2);
    // subtle horizontal grain every 14 rows
    for (let gy = FY + 8; gy < 132; gy += 14)
      floor += px(0, gy, 176, 1, fC2);

    // ═══════════════════════════════════════════════════════════════
    // 3. WINDOW (left wall)
    // ═══════════════════════════════════════════════════════════════
    let sky = '#b3e5fc', skyLo = '#81d4fa', curt = '#f48fb1', curtHi = '#f8bbd0';
    if (winSlot === 'win_night') { sky = '#1a237e'; skyLo = '#0d1547'; curt = '#5c6bc0'; curtHi = '#7986cb'; }
    if (winSlot === 'win_rain')  { sky = '#90a4ae'; skyLo = '#78909c'; curt = '#64b5f6'; curtHi = '#90caf9'; }

    let win = `
      <!-- window frame outer -->
      ${px(6, 8, 34, 2, '#d7ccc8')} ${px(6, 54, 34, 2, '#d7ccc8')}
      ${px(6, 8, 2, 48, '#d7ccc8')}  ${px(38, 8, 2, 48, '#d7ccc8')}
      <!-- window frame inner -->
      ${px(7, 9, 32, 1, '#efebe9')} ${px(7, 9, 1, 46, '#efebe9')}
      <!-- sky fill -->
      ${px(8, 10, 30, 44, sky)}
      ${px(8, 34, 30, 20, skyLo)}
      <!-- cross frame -->
      ${px(8, 31, 30, 2, '#efebe9')} ${px(22, 10, 2, 44, '#efebe9')}
      <!-- glass highlight -->
      ${px(10, 12, 3, 8, 'rgba(255,255,255,0.4)')}
      ${px(26, 12, 3, 6, 'rgba(255,255,255,0.3)')}`;

    if (winSlot === 'win_night') {
      // moon + stars
      win += `${px(28, 14, 6, 6, '#fdd835')} ${px(26, 14, 2, 2, '#1a237e')}
        ${px(12, 20, 2, 2, '#fff')} ${px(16, 14, 1, 1, '#fff')} ${px(30, 40, 1, 1, '#fff')}
        ${px(20, 44, 1, 1, '#fff')} ${px(34, 24, 1, 1, '#fff')}`;
    } else if (winSlot === 'win_rain') {
      // rain streaks
      for (let rx = 10; rx < 36; rx += 4)
        win += px(rx, 14 + (rx % 6), 1, 6, '#b0bec5');
    } else {
      // sun + clouds
      win += `${px(28, 14, 8, 8, '#fff176')} ${px(30, 12, 4, 2, '#ffee58')}
        ${px(26, 16, 2, 4, '#ffee58')} ${px(36, 16, 2, 4, '#ffee58')}
        ${px(10, 38, 10, 4, '#fff')} ${px(12, 36, 6, 2, '#fff')}
        ${px(24, 42, 8, 4, '#fff')} ${px(26, 40, 4, 2, '#fff')}`;
    }

    // curtains with fold highlights
    win += `
      ${px(2, 6, 6, 52, curt)} ${px(3, 6, 2, 52, curtHi)}
      ${px(36, 6, 8, 52, curt)} ${px(38, 6, 2, 52, curtHi)}
      <!-- curtain bottom scallops -->
      ${px(2, 58, 2, 2, curt)} ${px(6, 58, 2, 2, curt)}
      ${px(36, 58, 2, 2, curt)} ${px(40, 58, 2, 2, curt)}
      <!-- curtain rod -->
      ${px(0, 4, 46, 2, '#bcaaa4')} ${px(0, 4, 2, 3, '#a1887f')} ${px(44, 4, 2, 3, '#a1887f')}`;

    // ═══════════════════════════════════════════════════════════════
    // 4. WALL SHELF + plant + frame
    // ═══════════════════════════════════════════════════════════════
    const shelf = `
      <!-- shelf plank -->
      ${px(58, 26, 50, 3, '#8d6e63')} ${px(59, 27, 48, 1, '#a1887f')}
      ${px(58, 29, 50, 1, '#6d4c41')}
      <!-- brackets -->
      ${px(62, 29, 3, 10, '#795548')} ${px(63, 29, 1, 10, '#8d6e63')}
      ${px(101, 29, 3, 10, '#795548')} ${px(102, 29, 1, 10, '#8d6e63')}
      <!-- terra cotta pot -->
      ${px(65, 18, 10, 8, '#d4845a')} ${px(66, 16, 8, 2, '#d4845a')}
      ${px(67, 18, 6, 6, '#e09668')}
      ${px(64, 24, 12, 2, '#bf6830')}
      <!-- pot soil -->
      ${px(66, 17, 8, 1, '#5d4037')}
      <!-- plant leaves (multi-shade green) -->
      ${px(68, 8, 4, 9, '#43a047')} ${px(66, 10, 3, 6, '#66bb6a')}
      ${px(72, 9, 3, 7, '#2e7d32')} ${px(64, 12, 3, 4, '#81c784')}
      ${px(74, 11, 3, 4, '#4caf50')} ${px(69, 6, 2, 3, '#81c784')}
      <!-- heart frame -->
      ${px(86, 12, 18, 14, '#fff')}
      ${px(85, 11, 20, 1, '#f48fb1')} ${px(85, 26, 20, 1, '#f48fb1')}
      ${px(85, 11, 1, 16, '#f48fb1')} ${px(104, 11, 1, 16, '#f48fb1')}
      <!-- heart shape -->
      ${px(91, 16, 3, 2, '#e91e63')} ${px(96, 16, 3, 2, '#e91e63')}
      ${px(90, 18, 10, 2, '#e91e63')} ${px(91, 20, 8, 2, '#e91e63')}
      ${px(92, 22, 6, 2, '#e91e63')} ${px(94, 24, 2, 1, '#e91e63')}
      ${px(91, 16, 2, 1, '#f48fb1')}`;

    // ═══════════════════════════════════════════════════════════════
    // 5. WALL DECOR (right wall)
    // ═══════════════════════════════════════════════════════════════
    let decor = '';
    if (decorSlot === 'wall_calendar') {
      decor = `
        ${px(124, 8, 30, 30, '#fff')}
        ${px(123, 7, 32, 1, '#c8a882')} ${px(123, 38, 32, 1, '#c8a882')}
        ${px(123, 7, 1, 32, '#c8a882')} ${px(154, 7, 1, 32, '#c8a882')}
        <!-- calendar top bar -->
        ${px(125, 9, 28, 6, '#f48fb1')} ${px(126, 10, 26, 4, '#e91e63')}
        <!-- grid cells -->
        ${px(126, 17, 5, 3, '#eee')} ${px(132, 17, 5, 3, '#eee')} ${px(138, 17, 5, 3, '#eee')} ${px(144, 17, 5, 3, '#eee')}
        ${px(126, 22, 5, 3, '#eee')} ${px(132, 22, 5, 3, '#eee')} ${px(138, 22, 5, 3, '#eee')} ${px(144, 22, 5, 3, '#eee')}
        ${px(126, 27, 5, 3, '#eee')} ${px(132, 27, 5, 3, '#eee')} ${px(138, 27, 5, 3, '#eee')}
        <!-- marked day -->
        ${px(138, 22, 5, 3, '#ffcdd2')}
        <!-- cat face on top -->
        ${px(134, 2, 8, 6, '#fff')} ${px(134, 0, 2, 3, '#fff')} ${px(140, 0, 2, 3, '#fff')}
        ${px(136, 4, 1, 1, '#333')} ${px(139, 4, 1, 1, '#333')}`;
    } else if (decorSlot === 'wall_light') {
      // string lights
      decor = `
        ${px(120, 6, 40, 1, '#a1887f')}
        ${px(124, 7, 4, 5, '#29b6f6')} ${px(125, 8, 2, 3, '#4fc3f7')}
        ${px(132, 7, 4, 5, '#ef9a9a')} ${px(133, 8, 2, 3, '#ef5350')}
        ${px(140, 7, 4, 5, '#a5d6a7')} ${px(141, 8, 2, 3, '#66bb6a')}
        ${px(148, 7, 4, 5, '#ce93d8')} ${px(149, 8, 2, 3, '#ab47bc')}
        ${px(156, 7, 4, 5, '#ffe082')} ${px(157, 8, 2, 3, '#fdd835')}
        <!-- wire sag -->
        ${px(128, 7, 4, 1, '#a1887f')} ${px(136, 8, 4, 1, '#a1887f')}
        ${px(144, 7, 4, 1, '#a1887f')} ${px(152, 8, 4, 1, '#a1887f')}`;
    } else {
      // wall_frame: framed cat portrait
      decor = `
        ${px(124, 8, 30, 28, '#fff8f0')}
        ${px(123, 7, 32, 1, '#a1887f')} ${px(123, 36, 32, 1, '#a1887f')}
        ${px(123, 7, 1, 30, '#a1887f')} ${px(154, 7, 1, 30, '#a1887f')}
        ${px(124, 8, 30, 1, '#c8a882')} ${px(124, 8, 1, 28, '#c8a882')}
        <!-- pixel cat face -->
        ${px(133, 14, 12, 1, '#555')}
        ${px(132, 15, 14, 10, '#555')} ${px(133, 16, 12, 8, '#fff')}
        <!-- cat ears -->
        ${px(133, 12, 3, 3, '#555')} ${px(134, 13, 1, 1, '#ffcdd2')}
        ${px(142, 12, 3, 3, '#555')} ${px(143, 13, 1, 1, '#ffcdd2')}
        <!-- cat eyes and mouth -->
        ${px(135, 18, 2, 2, '#333')} ${px(141, 18, 2, 2, '#333')}
        ${px(137, 21, 4, 1, '#e91e63')}
        <!-- blush -->
        ${px(134, 20, 2, 1, '#ffcdd2')} ${px(142, 20, 2, 1, '#ffcdd2')}
        <!-- hanging hook -->
        ${px(138, 4, 2, 4, '#a1887f')}`;
    }

    // ═══════════════════════════════════════════════════════════════
    // 6. PINK CENTER RUG (wider, lower)
    // ═══════════════════════════════════════════════════════════════
    const rug = `
      ${px(42, 92, 92, 2, '#f8bbd0')}
      ${px(36, 94, 104, 2, '#f8bbd0')}
      ${px(30, 96, 116, 2, '#f48fb1')}
      ${px(26, 98, 124, 6, '#f48fb1')}
      ${px(30, 104, 116, 2, '#f48fb1')}
      ${px(36, 106, 104, 2, '#f8bbd0')}
      ${px(42, 108, 92, 2, '#f8bbd0')}
      <!-- inner lighter area -->
      ${px(48, 94, 80, 2, '#fce4ec')}
      ${px(40, 96, 96, 2, '#fce4ec')}
      ${px(34, 98, 108, 6, '#fce4ec')}
      ${px(40, 104, 96, 2, '#fce4ec')}
      ${px(48, 106, 80, 2, '#fce4ec')}`;

    // ═══════════════════════════════════════════════════════════════
    // 7. BED (left floor area)
    // ═══════════════════════════════════════════════════════════════
    let bed = '';
    if (bedSlot === 'bed_cushion') {
      // Cute donut bed (reference: pink ring, lighter inside, cat plush)
      bed = `
        <!-- donut outer ring -->
        ${px(8, 86, 44, 2, '#e91e63')}
        ${px(6, 88, 48, 2, '#f06292')}
        ${px(4, 90, 52, 6, '#f06292')}
        ${px(6, 96, 48, 2, '#f06292')}
        ${px(8, 98, 44, 2, '#e91e63')}
        <!-- donut inner ring (lighter) -->
        ${px(12, 88, 36, 2, '#f48fb1')}
        ${px(10, 90, 40, 6, '#f48fb1')}
        ${px(12, 96, 36, 2, '#f48fb1')}
        <!-- donut center hollow -->
        ${px(16, 90, 28, 6, '#fce4ec')}
        <!-- highlight -->
        ${px(8, 87, 12, 1, '#f8bbd0')} ${px(6, 89, 4, 2, '#f8bbd0')}
        <!-- white cat plush sitting in bed -->
        ${px(22, 78, 14, 12, '#fff')}
        ${px(21, 77, 16, 1, '#444')} ${px(21, 89, 16, 1, '#444')}
        ${px(21, 77, 1, 13, '#444')} ${px(36, 77, 1, 13, '#444')}
        <!-- plush ears -->
        ${px(22, 73, 4, 5, '#fff')} ${px(22, 72, 4, 1, '#444')} ${px(22, 72, 1, 6, '#444')} ${px(25, 72, 1, 6, '#444')}
        ${px(23, 73, 2, 3, '#ffcdd2')}
        ${px(32, 73, 4, 5, '#fff')} ${px(32, 72, 4, 1, '#444')} ${px(32, 72, 1, 6, '#444')} ${px(35, 72, 1, 6, '#444')}
        ${px(33, 73, 2, 3, '#ffcdd2')}
        <!-- plush face -->
        ${px(24, 81, 2, 2, '#333')} ${px(32, 81, 2, 2, '#333')}
        ${px(27, 84, 4, 1, '#f48fb1')}
        ${px(23, 83, 2, 1, '#f8bbd0')} ${px(33, 83, 2, 1, '#f8bbd0')}`;
    } else if (bedSlot === 'bed_box') {
      // Cardboard box bed
      bed = `
        ${px(6, 78, 46, 22, '#d4a456')} ${px(7, 79, 44, 20, '#e8c470')}
        ${px(6, 78, 46, 2, '#bf8c30')} ${px(6, 98, 46, 2, '#bf8c30')}
        ${px(6, 78, 2, 22, '#bf8c30')} ${px(50, 78, 2, 22, '#bf8c30')}
        <!-- open flaps -->
        ${px(6, 76, 12, 4, '#d4a456')} ${px(20, 76, 6, 2, '#e8c470')}
        ${px(34, 76, 12, 4, '#d4a456')} ${px(28, 76, 8, 2, '#e8c470')}
        <!-- blanket inside -->
        ${px(10, 84, 36, 10, '#f48fb1')} ${px(12, 84, 32, 8, '#f8bbd0')}
        <!-- box tape -->
        ${px(26, 78, 6, 22, '#c8923a')}`;
    } else {
      // bed_wood: wooden frame hammock
      bed = `
        <!-- wood posts -->
        ${px(6, 72, 5, 28, '#8d6e63')} ${px(7, 73, 3, 26, '#a1887f')}
        ${px(47, 72, 5, 28, '#8d6e63')} ${px(48, 73, 3, 26, '#a1887f')}
        <!-- post tops -->
        ${px(5, 70, 7, 3, '#6d4c41')} ${px(46, 70, 7, 3, '#6d4c41')}
        <!-- fabric hammock sling -->
        ${px(11, 80, 36, 14, '#f8bbd0')} ${px(12, 81, 34, 12, '#fce4ec')}
        ${px(11, 78, 36, 2, '#e91e63')} ${px(11, 94, 36, 2, '#e91e63')}
        <!-- inner cushion -->
        ${px(16, 84, 26, 6, '#fff')} ${px(17, 85, 24, 4, '#fce4ec')}`;
    }

    // ═══════════════════════════════════════════════════════════════
    // 8. FOOD BOWL (left-center, on floor)
    // ═══════════════════════════════════════════════════════════════
    let bowl = '';
    if (bowlSlot === 'bowl_plastic') {
      // Pink bowl with paw logo (reference style)
      bowl = `
        ${px(52, 92, 24, 2, '#e91e63')}
        ${px(50, 94, 28, 6, '#f06292')}
        ${px(52, 100, 24, 2, '#e91e63')}
        <!-- bowl highlight -->
        ${px(52, 93, 8, 1, '#f48fb1')} ${px(50, 95, 3, 2, '#f48fb1')}
        <!-- kibble fill -->
        ${px(53, 93, 22, 3, '#8d6e63')}
        ${px(54, 93, 3, 2, '#a1887f')} ${px(60, 93, 3, 2, '#a1887f')} ${px(66, 93, 3, 2, '#a1887f')} ${px(72, 94, 2, 1, '#a1887f')}
        <!-- white paw on front -->
        ${px(61, 97, 2, 1, '#fff')} ${px(65, 97, 2, 1, '#fff')}
        ${px(60, 98, 8, 2, '#fff')} ${px(62, 100, 4, 1, '#fff')}`;
    } else if (bowlSlot === 'bowl_ceramic') {
      // Blue/white ceramic
      bowl = `
        ${px(52, 92, 24, 2, '#1565c0')}
        ${px(50, 94, 28, 6, '#42a5f5')}
        ${px(52, 100, 24, 2, '#1565c0')}
        ${px(52, 93, 8, 1, '#64b5f6')} ${px(50, 95, 3, 2, '#64b5f6')}
        ${px(53, 93, 22, 3, '#8d6e63')}
        ${px(56, 93, 3, 2, '#a1887f')} ${px(62, 93, 3, 2, '#a1887f')} ${px(68, 93, 2, 2, '#a1887f')}
        <!-- paw print decoration -->
        ${px(60, 97, 3, 1, '#fff')} ${px(64, 97, 3, 1, '#fff')}
        ${px(61, 98, 5, 2, '#fff')}`;
    } else {
      // bowl_wood: elevated double stand
      bowl = `
        <!-- wood base -->
        ${px(48, 98, 34, 4, '#8d6e63')} ${px(49, 99, 32, 2, '#a1887f')}
        ${px(47, 97, 36, 1, '#6d4c41')}
        <!-- left bowl -->
        ${px(50, 90, 14, 8, '#f06292')} ${px(51, 91, 12, 5, '#8d6e63')}
        ${px(52, 91, 3, 2, '#a1887f')} ${px(58, 92, 3, 1, '#a1887f')}
        <!-- right bowl (water) -->
        ${px(66, 90, 14, 8, '#42a5f5')} ${px(67, 91, 12, 5, '#90caf9')}
        ${px(68, 91, 4, 2, '#bbdefb')}`;
    }

    // ═══════════════════════════════════════════════════════════════
    // 9. CAT TOWER (right area, tall — base on floor)
    // ═══════════════════════════════════════════════════════════════
    let tower = '';
    if (towerSlot === 'tower_mini') {
      tower = `
        <!-- base -->
        ${px(118, 122, 24, 4, '#a1887f')} ${px(119, 123, 22, 2, '#bcaaa4')}
        <!-- single pole with rope texture -->
        ${px(126, 72, 8, 50, '#d7ccc8')}
        ${px(127, 74, 2, 46, '#c8b8a8')} ${px(131, 74, 2, 46, '#c8b8a8')}
        <!-- top platform -->
        ${px(114, 68, 32, 4, '#8d6e63')} ${px(115, 69, 30, 2, '#a1887f')}
        <!-- dangling ball -->
        ${px(140, 72, 1, 8, '#f48fb1')}
        ${px(138, 80, 5, 5, '#f06292')} ${px(139, 81, 3, 3, '#f48fb1')}`;
    } else {
      // tower_wood: multi-level with house
      tower = `
        <!-- base -->
        ${px(110, 122, 36, 4, '#8d6e63')} ${px(111, 123, 34, 2, '#a1887f')}
        <!-- left pole -->
        ${px(116, 38, 7, 84, '#d7ccc8')}
        ${px(117, 40, 2, 80, '#c8b8a8')} ${px(121, 40, 2, 80, '#c8b8a8')}
        <!-- right pole -->
        ${px(134, 56, 6, 66, '#d7ccc8')}
        ${px(135, 58, 2, 62, '#c8b8a8')}
        <!-- top platform -->
        ${px(108, 34, 34, 4, '#8d6e63')} ${px(109, 35, 32, 2, '#a1887f')}
        <!-- middle platform -->
        ${px(112, 72, 28, 4, '#8d6e63')} ${px(113, 73, 26, 2, '#a1887f')}
        <!-- house box -->
        ${px(108, 38, 30, 34, '#bcaaa4')} ${px(109, 39, 28, 32, '#d7ccc8')}
        <!-- entrance hole -->
        ${px(118, 52, 10, 14, '#4e342e')} ${px(119, 53, 8, 12, '#3e2723')}
        <!-- roof edge -->
        ${px(106, 36, 34, 2, '#795548')}
        <!-- dangling toy -->
        ${px(140, 38, 1, 10, '#f48fb1')}
        ${px(138, 48, 5, 5, '#f06292')} ${px(139, 49, 3, 3, '#f48fb1')}`;
    }

    // ═══════════════════════════════════════════════════════════════
    // 10. SIDE CABINET (far right, on floor)
    // ═══════════════════════════════════════════════════════════════
    const cabinet = `
      ${px(148, FY, 26, 56, '#fff')}
      ${px(147, FY - 1, 28, 1, '#c8a882')} ${px(147, 130, 28, 2, '#c8a882')}
      ${px(147, FY - 1, 1, 58, '#c8a882')} ${px(174, FY - 1, 1, 58, '#c8a882')}
      <!-- top edge highlight -->
      ${px(149, FY, 24, 1, '#efebe9')}
      <!-- top drawer (pink) -->
      ${px(150, FY + 4, 22, 20, '#fce4ec')}
      ${px(150, FY + 4, 22, 1, '#f8bbd0')} ${px(150, FY + 23, 22, 1, '#f8bbd0')}
      ${px(159, FY + 10, 4, 4, '#f48fb1')}
      <!-- bottom drawer (blue) -->
      ${px(150, FY + 28, 22, 20, '#e3f2fd')}
      ${px(150, FY + 28, 22, 1, '#bbdefb')} ${px(150, FY + 47, 22, 1, '#bbdefb')}
      ${px(159, FY + 34, 4, 4, '#64b5f6')}
      <!-- paw logo on top drawer -->
      ${px(158, FY + 8, 2, 1, '#f48fb1')} ${px(162, FY + 8, 2, 1, '#f48fb1')}
      ${px(157, FY + 9, 8, 3, '#f48fb1')} ${px(159, FY + 12, 4, 1, '#f48fb1')}`;

    // ═══════════════════════════════════════════════════════════════
    // 11. FLOOR CUSHION (center-right, LOW on floor)
    // ═══════════════════════════════════════════════════════════════
    let cushion = '';
    if (cushSlot === 'cushion_default') {
      // Mint/teal round cushion (reference: fat, soft looking)
      cushion = `
        ${px(100, 116, 30, 2, '#4db6ac')}
        ${px(96, 118, 38, 2, '#4db6ac')}
        ${px(94, 120, 42, 4, '#4db6ac')}
        ${px(96, 124, 38, 2, '#4db6ac')}
        ${px(100, 126, 30, 2, '#4db6ac')}
        <!-- inner lighter -->
        ${px(102, 118, 26, 2, '#80cbc4')}
        ${px(98, 120, 34, 4, '#80cbc4')}
        ${px(102, 124, 26, 2, '#80cbc4')}
        <!-- tufted button -->
        ${px(113, 121, 4, 2, '#00897b')}
        <!-- highlight -->
        ${px(98, 118, 6, 1, '#b2dfdb')}`;
    } else if (cushSlot === 'cushion_fish') {
      // Fish cushion (blue, with eye and tail)
      cushion = `
        <!-- tail -->
        ${px(92, 118, 6, 2, '#0277bd')} ${px(90, 120, 4, 4, '#0277bd')} ${px(92, 124, 6, 2, '#0277bd')}
        <!-- body -->
        ${px(96, 116, 34, 2, '#29b6f6')}
        ${px(94, 118, 38, 2, '#29b6f6')}
        ${px(94, 120, 38, 4, '#29b6f6')}
        ${px(94, 124, 38, 2, '#29b6f6')}
        ${px(96, 126, 34, 2, '#29b6f6')}
        <!-- inner -->
        ${px(98, 118, 30, 2, '#4fc3f7')} ${px(96, 120, 34, 4, '#4fc3f7')} ${px(98, 124, 30, 2, '#4fc3f7')}
        <!-- eye -->
        ${px(120, 120, 3, 3, '#fff')} ${px(121, 121, 2, 2, '#333')}
        <!-- mouth -->
        ${px(126, 122, 4, 1, '#0277bd')}`;
    } else {
      // cushion_donut: pink donut
      cushion = `
        ${px(98, 116, 34, 2, '#f06292')}
        ${px(94, 118, 42, 2, '#f06292')}
        ${px(92, 120, 46, 4, '#f06292')}
        ${px(94, 124, 42, 2, '#f06292')}
        ${px(98, 126, 34, 2, '#f06292')}
        <!-- inner ring -->
        ${px(102, 118, 26, 2, '#f48fb1')} ${px(98, 120, 34, 4, '#f48fb1')} ${px(102, 124, 26, 2, '#f48fb1')}
        <!-- hole -->
        ${px(106, 120, 18, 4, '#fce4ec')}
        <!-- sprinkles -->
        ${px(96, 119, 2, 1, '#fff176')} ${px(104, 117, 2, 1, '#81c784')} ${px(126, 119, 2, 1, '#29b6f6')}`;
    }

    // ═══════════════════════════════════════════════════════════════
    // 12. TOY (center of rug area)
    // ═══════════════════════════════════════════════════════════════
    let toy = '';
    if (toySlot === 'toy_yarn') {
      // Yarn ball with loose strand
      toy = `
        ${px(66, 106, 10, 2, '#e91e63')}
        ${px(64, 108, 14, 2, '#f06292')}
        ${px(64, 110, 14, 2, '#e91e63')}
        ${px(66, 112, 10, 2, '#f06292')}
        <!-- yarn highlights -->
        ${px(66, 107, 3, 1, '#f48fb1')} ${px(72, 109, 2, 1, '#f48fb1')}
        <!-- cross pattern -->
        ${px(68, 106, 1, 8, '#c2185b')} ${px(72, 106, 1, 8, '#c2185b')}
        <!-- loose strand -->
        ${px(62, 108, 2, 1, '#e91e63')} ${px(60, 109, 2, 1, '#e91e63')} ${px(60, 110, 3, 1, '#e91e63')}`;
    } else if (toySlot === 'toy_mouse') {
      // Wind-up mouse
      toy = `
        <!-- body -->
        ${px(62, 108, 18, 6, '#9e9e9e')} ${px(63, 109, 16, 4, '#bdbdbd')}
        <!-- ears -->
        ${px(62, 105, 4, 4, '#757575')} ${px(63, 106, 2, 2, '#f48fb1')}
        ${px(68, 105, 4, 4, '#757575')} ${px(69, 106, 2, 2, '#f48fb1')}
        <!-- eye -->
        ${px(63, 109, 2, 2, '#333')}
        <!-- nose -->
        ${px(62, 111, 2, 1, '#f48fb1')}
        <!-- tail -->
        ${px(78, 110, 4, 2, '#757575')} ${px(80, 112, 2, 2, '#757575')}
        <!-- wind-up key -->
        ${px(72, 106, 4, 3, '#fdd835')} ${px(73, 104, 2, 2, '#fbc02d')}`;
    } else {
      // toy_circuit: circuit board
      toy = `
        ${px(60, 106, 24, 10, '#2e7d32')} ${px(61, 107, 22, 8, '#388e3c')}
        <!-- components -->
        ${px(63, 108, 4, 3, '#f44336')} ${px(69, 108, 4, 3, '#2196f3')}
        ${px(75, 109, 4, 2, '#ffc107')}
        <!-- traces -->
        ${px(62, 112, 20, 1, '#81c784')} ${px(67, 107, 1, 6, '#81c784')}
        <!-- LED glow -->
        ${px(63, 108, 2, 1, '#ff8a80')}`;
    }

    // ═══════════════════════════════════════════════════════════════
    // 13. CAT POSITION (matches item SVG coordinates)
    //
    // Cat sprite at p=4: ~96×96 SVG px.  Feet at sprite y=22*4=88.
    // To place cat feet at SVG point Y: translateY = Y - 88.
    //
    // Item centers (room grid × p=2.5):
    //   Bed:   center ≈ (28,92) → SVG (70, 230)
    //   Bowl:  center ≈ (64,96) → SVG (160, 240)
    //   Rug:   center ≈ (88,100)→ SVG (220, 250)
    //   Toy:   center ≈ (72,110)→ SVG (180, 275)
    //   Cushion: center ≈ (115,122)→ SVG (287, 305)
    // ═══════════════════════════════════════════════════════════════
    let catX = 170, catY = 162;  // IDLE: center of rug (feet at SVG y=250)
    if (catState === BEHAVIOR_STATES.SLEEPING || catState === BEHAVIOR_STATES.SLEEPY) {
      catX = 26;  catY = 150;   // SLEEPING: curled in bed (feet at SVG y=230)
    } else if (catState === BEHAVIOR_STATES.HUNGRY) {
      catX = 65;  catY = 152;   // EATING: next to bowl (feet at SVG y=240)
    } else if (catState === BEHAVIOR_STATES.HAPPY) {
      catX = 130; catY = 150;   // PLAYING: near toy, slightly elevated
    } else if (catState === BEHAVIOR_STATES.ANGRY) {
      catX = 170; catY = 162;   // PETTING: stays at rug center
    } else if (catState === BEHAVIOR_STATES.STARTLED) {
      catX = 170; catY = 155;   // STARTLED: same area, slightly higher
    }

    return `
<svg id="mainRoomSvg" viewBox="0 0 440 330" xmlns="http://www.w3.org/2000/svg"
     style="width:100%;height:100%;display:block;" shape-rendering="crispEdges">
  ${wall}
  ${win}
  ${shelf}
  ${decor}
  ${floor}
  ${rug}
  ${bed}
  ${bowl}
  ${tower}
  ${cushion}
  ${toy}
  ${cabinet}
  <g transform="translate(${catX}, ${catY})">${catSvgContent}</g>
</svg>`;
  }
}
