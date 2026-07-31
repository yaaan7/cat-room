/**
 * Cat Room - Unified Game Event Dispatcher
 */

import { GAME_CONFIG, ITEM_CATALOG } from '../config.js';
import { TemplateEngine } from './templates.js';
import { ToastManager } from '../ui/toast.js';

export class GameEventDispatcher {
  constructor(catState, storageManager, uiCallback) {
    this.catState = catState;
    this.storageManager = storageManager;
    this.uiCallback = uiCallback;
    this.lastEventTime = 0;
  }

  // Unified Event Dispatch Handler (Supports UI & Hardware events)
  dispatch(event) {
    if (!event || !event.type) return;

    // Debug Log 3: Game Action Dispatch
    console.log('[Game Action]', event.type);

    const now = Date.now();
    // 300ms Debounce Check (Skip debounce for continuous / long events)
    if (now - this.lastEventTime < GAME_CONFIG.DEBOUNCE_MS &&
        event.type !== 'PET_LONG' && event.type !== 'LIGHT_BRIGHT' && event.type !== 'LIGHT_DARK') {
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
        result = this.catState.petCat(false, event.duration || 500);
        if (result.success) this.incrementCounter('petCount');
        break;

      case 'PET_LONG':
        actionName = 'PET';
        result = this.catState.petCat(true, event.duration || 2000);
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
        actionName = 'APPROACH_SLOW';
        result = this.catState.handleApproach(false);
        break;

      case 'APPROACH_FAST':
        actionName = 'APPROACH_FAST';
        result = this.catState.handleApproach(true);
        break;

      case 'PERSON_LEFT':
        actionName = 'PERSON_LEFT';
        this.catState.evaluateBehaviorState();
        break;

      case 'LIGHT_DARK':
        actionName = 'LIGHT_DARK';
        const darkChanged = this.catState.setLightState(true);
        result = { success: darkChanged, reason: 'NORMAL' };
        break;

      case 'LIGHT_BRIGHT':
        actionName = 'LIGHT_BRIGHT';
        const brightChanged = this.catState.setLightState(false);
        result = { success: brightChanged, reason: 'NORMAL' };
        break;

      default:
        console.warn('Unknown event type dispatched:', event.type);
        return;
    }

    // Get Natural Language Reaction Quote
    const reactionText = TemplateEngine.getReaction(actionName, result.reason);

    // Dynamic Check & Trigger Item Unlocks across all catalog items
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
    if (!data.counters) data.counters = {};
    data.counters[counterKey] = (data.counters[counterKey] || 0) + 1;
    this.storageManager.saveData(data);
  }

  checkUnlockableItems() {
    const data = this.storageManager.loadData();
    const counters = data.counters || {};
    const unlocked = new Set(data.unlockedItems || []);
    const newlyUnlocked = [];

    for (const slotKey in ITEM_CATALOG) {
      const items = ITEM_CATALOG[slotKey];
      items.forEach(item => {
        if (item.default || unlocked.has(item.id)) return;
        if (!item.unlockCondition) return;

        const [key, val] = item.unlockCondition.split(':');
        let isMet = false;

        if (key === 'feedCount') isMet = (counters.feedCount || 0) >= parseInt(val, 10);
        else if (key === 'petCount') isMet = (counters.petCount || 0) >= parseInt(val, 10);
        else if (key === 'playCount') isMet = (counters.playCount || 0) >= parseInt(val, 10);
        else if (key === 'captureCount') isMet = (counters.captureCount || 0) >= parseInt(val, 10);
        else if (key === 'affection') isMet = (this.catState.affection || 0) >= parseInt(val, 10);
        else if (key === 'arduinoConnected') isMet = data.flags?.hasConnectedArduino === true;

        if (isMet) {
          unlocked.add(item.id);
          newlyUnlocked.push(item);
        }
      });
    }

    if (newlyUnlocked.length > 0) {
      data.unlockedItems = Array.from(unlocked);
      this.storageManager.saveData(data);
      newlyUnlocked.forEach(item => {
        ToastManager.show(`🎁 새 아이템 해금: ${item.name} (${item.icon})!`);
      });
    }
  }
}
