/**
 * Cat Room - localStorage Storage Manager
 * Fixed: deep-merge roomSlots so equipped items are never lost on reload
 */

import { GAME_CONFIG } from '../config.js';

export class StorageManager {
  static getInitialState() {
    return {
      version: GAME_CONFIG.APP_VERSION,
      catProfile: { name: '나비', createdAt: Date.now() },
      metrics: { hunger: 30, happiness: 70, affection: 20, energy: 80, stress: 10 },
      currentState: 'IDLE',
      roomSlots: {
        wallpaper: 'wp_beige',
        floor:     'fl_wood',
        bed:       'bed_cushion',
        bowl:      'bowl_plastic',
        catTower:  'tower_mini',
        cushion:   'cushion_default',
        toy:       'toy_yarn',
        window:    'win_day',
        wallDecor: 'wall_frame'
      },
      unlockedItems: [
        'wp_beige','fl_wood','bed_cushion','bowl_plastic',
        'tower_mini','cushion_default','toy_yarn','win_day','wall_frame'
      ],
      counters: { feedCount: 0, petCount: 0, playCount: 0, captureCount: 0 },
      flags: { hasConnectedArduino: false, isFirstVisit: true },
      lastSavedTimestamp: Date.now()
    };
  }

  static loadData() {
    try {
      const raw = localStorage.getItem(GAME_CONFIG.STORAGE_KEY);
      if (!raw) return this.getInitialState();
      const parsed = JSON.parse(raw);
      const initial = this.getInitialState();
      // Deep-merge so nested objects like roomSlots are properly combined
      return {
        ...initial,
        ...parsed,
        roomSlots: { ...initial.roomSlots, ...(parsed.roomSlots || {}) },
        metrics:   { ...initial.metrics,   ...(parsed.metrics   || {}) },
        counters:  { ...initial.counters,  ...(parsed.counters  || {}) },
        flags:     { ...initial.flags,     ...(parsed.flags     || {}) }
      };
    } catch (e) {
      console.warn('Failed to parse localStorage, resetting.', e);
      return this.getInitialState();
    }
  }

  static saveData(state) {
    try {
      localStorage.setItem(GAME_CONFIG.STORAGE_KEY, JSON.stringify({
        ...state,
        lastSavedTimestamp: Date.now()
      }));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  static clearData() {
    try { localStorage.removeItem(GAME_CONFIG.STORAGE_KEY); }
    catch (e) { console.error('Failed to clear localStorage:', e); }
  }
}
