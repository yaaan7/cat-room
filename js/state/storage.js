/**
 * Cat Room - localStorage Storage Manager
 */

import { GAME_CONFIG } from '../config.js';

export class StorageManager {
  static getInitialState() {
    return {
      version: GAME_CONFIG.APP_VERSION,
      catProfile: {
        name: '나비',
        createdAt: Date.now()
      },
      metrics: {
        hunger: 30,
        happiness: 70,
        affection: 20,
        energy: 80,
        stress: 10
      },
      currentState: 'IDLE',
      roomSlots: {
        wallpaper: 'wp_beige',
        floor: 'fl_wood',
        bed: 'bed_cushion',
        bowl: 'bowl_plastic',
        catTower: 'tower_mini',
        cushion: 'cushion_default',
        toy: 'toy_yarn',
        window: 'win_day',
        wallDecor: 'wall_frame'
      },
      unlockedItems: [
        'wp_beige', 'fl_wood', 'bed_cushion', 'bowl_plastic', 
        'tower_mini', 'cushion_default', 'toy_yarn', 'win_day', 
        'wallDecor'
      ],
      counters: {
        feedCount: 0,
        petCount: 0,
        playCount: 0,
        captureCount: 0
      },
      flags: {
        hasConnectedArduino: false,
        isFirstVisit: true
      },
      lastSavedTimestamp: Date.now()
    };
  }

  static loadData() {
    try {
      const raw = localStorage.getItem(GAME_CONFIG.STORAGE_KEY);
      if (!raw) return this.getInitialState();
      const parsed = JSON.parse(raw);
      return { ...this.getInitialState(), ...parsed };
    } catch (e) {
      console.warn('Failed to parse localStorage, resetting to default.', e);
      return this.getInitialState();
    }
  }

  static saveData(state) {
    try {
      const payload = {
        ...state,
        lastSavedTimestamp: Date.now()
      };
      localStorage.setItem(GAME_CONFIG.STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  static clearData() {
    try {
      localStorage.removeItem(GAME_CONFIG.STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
  }
}
