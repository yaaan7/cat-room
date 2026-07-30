/**
 * Cat Room - Unified Game Event Dispatcher
 */

import { GAME_CONFIG } from '../config.js';
import { TemplateEngine } from './templates.js';

export class GameEventDispatcher {
  constructor(catState, storageManager, uiCallback) {
    this.catState = catState;
    this.storageManager = storageManager;
    this.uiCallback = uiCallback;
    this.lastEventTime = 0;
  }

  // Unified Event Dispatch Handler
  dispatch(event) {
    const now = Date.now();
    // 300ms Debounce Check
    if (now - this.lastEventTime < GAME_CONFIG.DEBOUNCE_MS && event.type !== 'PET_LONG') {
      return;
    }
    this.lastEventTime = now;

    let result = { success: true, reason: 'NORMAL' };
    let actionName = event.type;

    switch (event.type) {
      case 'FEED':
        result = this.catState.feedCat();
        if (result.success) this.incrementCounter('feedCount');
        break;

      case 'PET_SHORT':
      case 'PET':
        actionName = 'PET';
        result = this.catState.petCat(false);
        if (result.success) this.incrementCounter('petCount');
        break;

      case 'PET_LONG':
        actionName = 'PET';
        result = this.catState.petCat(true);
        if (result.success) this.incrementCounter('petCount');
        break;

      case 'PLAY':
        result = this.catState.playWithCat();
        if (result.success) this.incrementCounter('playCount');
        break;

      case 'SLEEP':
        result = this.catState.sleepCat();
        break;

      case 'APPROACH_SLOW':
        result = this.catState.handleApproach(false);
        break;

      case 'APPROACH_FAST':
        result = this.catState.handleApproach(true);
        break;

      case 'PERSON_LEFT':
        this.catState.evaluateBehaviorState();
        break;

      case 'LIGHT_DARK':
        this.catState.setLightState(true);
        break;

      case 'LIGHT_BRIGHT':
        this.catState.setLightState(false);
        break;

      default:
        console.warn('Unknown event type dispatched:', event.type);
        return;
    }

    // Get Natural Language Reaction Quote
    const reactionText = TemplateEngine.getReaction(actionName, result.reason);

    // Check & Trigger Item Unlocks
    this.checkUnlockableItems();

    // Trigger Full UI Update Callback
    if (this.uiCallback) {
      this.uiCallback({
        event,
        result,
        reactionText,
        catState: this.catState
      });
    }
  }

  incrementCounter(counterKey) {
    const data = this.storageManager.loadData();
    data.counters[counterKey] = (data.counters[counterKey] || 0) + 1;
    this.storageManager.saveData(data);
  }

  checkUnlockableItems() {
    const data = this.storageManager.loadData();
    const counters = data.counters || {};
    const unlocked = new Set(data.unlockedItems || []);

    let newUnlock = false;

    if (counters.feedCount >= 1 && !unlocked.has('cushion_fish')) {
      unlocked.add('cushion_fish');
      newUnlock = true;
    }
    if (counters.feedCount >= 1 && !unlocked.has('wp_pink')) {
      unlocked.add('wp_pink');
      newUnlock = true;
    }
    if (this.catState.affection >= 50 && !unlocked.has('tower_wood')) {
      unlocked.add('tower_wood');
      newUnlock = true;
    }
    if (counters.captureCount >= 3 && !unlocked.has('wall_calendar')) {
      unlocked.add('wall_calendar');
      newUnlock = true;
    }
    if (data.flags?.hasConnectedArduino && !unlocked.has('toy_circuit')) {
      unlocked.add('toy_circuit');
      unlocked.add('wall_light');
      newUnlock = true;
    }

    if (newUnlock) {
      data.unlockedItems = Array.from(unlocked);
      this.storageManager.saveData(data);
    }
  }
}
