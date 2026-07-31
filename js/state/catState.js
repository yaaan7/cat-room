/**
 * Cat Room - Cat State & Behavior State Machine Model
 */

import { METRIC_LIMITS, BEHAVIOR_STATES } from '../config.js';

export class CatState {
  constructor(initialData = {}) {
    this.name = initialData.name || '나비';

    // 5 Key Metrics (0 - 100)
    this.hunger = initialData.hunger !== undefined ? initialData.hunger : 30; // Higher = hungrier
    this.happiness = initialData.happiness !== undefined ? initialData.happiness : 70;
    this.affection = initialData.affection !== undefined ? initialData.affection : 20;
    this.energy = initialData.energy !== undefined ? initialData.energy : 80;
    this.stress = initialData.stress !== undefined ? initialData.stress : 10;

    // Current Behavioral State (1 of 8)
    this.currentState = initialData.currentState || BEHAVIOR_STATES.IDLE;

    // Recent interaction timestamp trackers
    this.lastPetTimes = [];
    this.isNightMode = false;
    this.transientTimer = null;

    this.evaluateBehaviorState();
  }

  clamp(val) {
    return Math.max(METRIC_LIMITS.MIN, Math.min(METRIC_LIMITS.MAX, Math.round(val)));
  }

  updateMetrics(delta = {}) {
    if (delta.hunger !== undefined) this.hunger = this.clamp(this.hunger + delta.hunger);
    if (delta.happiness !== undefined) this.happiness = this.clamp(this.happiness + delta.happiness);
    if (delta.affection !== undefined) this.affection = this.clamp(this.affection + delta.affection);
    if (delta.energy !== undefined) this.energy = this.clamp(this.energy + delta.energy);
    if (delta.stress !== undefined) this.stress = this.clamp(this.stress + delta.stress);

    this.evaluateBehaviorState();
  }

  evaluateBehaviorState() {
    // If in a transient state (like temporary eating/petting/startled), don't override immediately
    if (this.isTransient) return;

    if (this.stress >= 70) {
      this.currentState = BEHAVIOR_STATES.ANGRY;
    } else if (this.isNightMode || this.energy <= 20) {
      this.currentState = this.energy <= 20 ? BEHAVIOR_STATES.SLEEPY : BEHAVIOR_STATES.SLEEPING;
    } else if (this.hunger >= 70) {
      this.currentState = BEHAVIOR_STATES.HUNGRY;
    } else if (this.happiness >= 80 && this.stress < 30) {
      this.currentState = BEHAVIOR_STATES.HAPPY;
    } else if (this.happiness < 30 && this.stress < 50) {
      this.currentState = BEHAVIOR_STATES.INDIFFERENT;
    } else {
      this.currentState = BEHAVIOR_STATES.IDLE;
    }
  }

  setTransientState(tempState, durationMs = 2500) {
    if (this.transientTimer) clearTimeout(this.transientTimer);
    this.isTransient = true;
    this.currentState = tempState;

    this.transientTimer = setTimeout(() => {
      this.isTransient = false;
      this.evaluateBehaviorState();
    }, durationMs);
  }

  // Action: Feed Cat
  feedCat() {
    if (this.currentState === BEHAVIOR_STATES.SLEEPING && this.isNightMode) {
      this.updateMetrics({ stress: +25 });
      this.setTransientState(BEHAVIOR_STATES.ANGRY, 2000);
      return { success: false, reason: 'SLEEPING_DISTURBED' };
    }

    if (this.hunger <= 10) {
      // Cat is completely full
      this.updateMetrics({ stress: +10 });
      return { success: false, reason: 'FULL' };
    }

    // Success Feed -> Show eating pose & move near bowl for 3s
    this.updateMetrics({ hunger: -35, affection: +3, happiness: +10 });
    this.setTransientState(BEHAVIOR_STATES.HUNGRY, 3000);
    return { success: true, reason: 'NORMAL' };
  }

  // Action: Pet Cat
  petCat(isLong = false, duration = 0) {
    const now = Date.now();
    this.lastPetTimes = this.lastPetTimes.filter(t => now - t < 3000);
    this.lastPetTimes.push(now);

    if (this.currentState === BEHAVIOR_STATES.SLEEPING && this.isNightMode) {
      this.updateMetrics({ stress: +30 });
      this.setTransientState(BEHAVIOR_STATES.ANGRY, 2500);
      return { success: false, reason: 'SLEEPING_DISTURBED' };
    }

    if (this.lastPetTimes.length >= 5 || this.stress >= 65) {
      this.updateMetrics({ stress: +20, happiness: -10 });
      this.setTransientState(BEHAVIOR_STATES.ANGRY, 2500);
      return { success: false, reason: 'OVERPETTED' };
    }

    // Calculate pet bonus capped at max 2.5x
    let bonus = isLong ? 1.8 : 1.0;
    if (duration > 0) {
      const computed = 1.0 + (duration / 1000) * 0.5;
      bonus = Math.min(2.5, Math.max(1.0, computed));
    }

    const affGain = Math.round(5 * bonus);
    const hapGain = Math.round(8 * bonus);

    this.updateMetrics({ affection: affGain, happiness: hapGain, stress: -5 });
    // Show petting pose
    this.setTransientState(BEHAVIOR_STATES.ANGRY, 2500);
    return { success: true, reason: isLong ? 'PET_LONG' : 'NORMAL' };
  }

  // Action: Play with Cat
  playWithCat() {
    if (this.currentState === BEHAVIOR_STATES.SLEEPING) {
      this.updateMetrics({ stress: +30 });
      this.setTransientState(BEHAVIOR_STATES.ANGRY, 2000);
      return { success: false, reason: 'SLEEPING_DISTURBED' };
    }

    if (this.energy <= 20) {
      this.updateMetrics({ stress: +10 });
      return { success: false, reason: 'TIRED' };
    }

    this.updateMetrics({ happiness: +20, energy: -15, hunger: +10 });
    this.setTransientState(BEHAVIOR_STATES.HAPPY, 3000);
    return { success: true, reason: 'NORMAL' };
  }

  // Action: Sleep Cat
  sleepCat() {
    if (this.currentState === BEHAVIOR_STATES.SLEEPING) {
      return { success: true, reason: 'ALREADY_SLEEPING' };
    }
    this.currentState = BEHAVIOR_STATES.SLEEPING;
    this.updateMetrics({ energy: +30, stress: -15 });
    return { success: true, reason: 'NORMAL' };
  }

  // Environment: Light changes
  setLightState(isDark) {
    if (this.isNightMode === isDark) return false; // Prevents unnecessary re-eval
    this.isNightMode = isDark;
    if (isDark) {
      this.currentState = BEHAVIOR_STATES.SLEEPING;
      this.updateMetrics({ energy: +10 });
    } else {
      this.isTransient = false;
      this.evaluateBehaviorState();
    }
    return true; // State changed
  }

  // Environment: Ultrasonic proximity approach
  handleApproach(isFast) {
    if (isFast) {
      this.updateMetrics({ stress: +15, happiness: -10 });
      this.setTransientState(BEHAVIOR_STATES.STARTLED, 3000);
      return { success: true, reason: 'STARTLED' };
    } else {
      this.updateMetrics({ happiness: +10, affection: +2 });
      this.setTransientState(BEHAVIOR_STATES.HAPPY, 2500);
      return { success: true, reason: 'CURIOUS' };
    }
  }

  processTick() {
    if (this.currentState === BEHAVIOR_STATES.SLEEPING) {
      this.updateMetrics({ energy: +10, stress: -5 });
    } else {
      this.updateMetrics({ hunger: +3, energy: -2, stress: -1 });
    }
  }
}
