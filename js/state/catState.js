/**
 * Cat Room - Cat State & Behavior State Machine Model
 */

import { METRIC_LIMITS, BEHAVIOR_STATES } from '../config.js';

export class CatState {
  constructor(initialData = {}) {
    this.name = initialData.name || '나비';
    
    // 5 Key Metrics (0 - 100)
    this.hunger = initialData.hunger !== undefined ? initialData.hunger : 30;     // Higher = hungrier
    this.happiness = initialData.happiness !== undefined ? initialData.happiness : 70;
    this.affection = initialData.affection !== undefined ? initialData.affection : 20;
    this.energy = initialData.energy !== undefined ? initialData.energy : 80;
    this.stress = initialData.stress !== undefined ? initialData.stress : 10;

    // Current Behavioral State (1 of 8)
    this.currentState = initialData.currentState || BEHAVIOR_STATES.IDLE;
    
    // Recent interaction timestamp trackers
    this.lastPetTimes = [];
    this.isNightMode = false;

    this.evaluateBehaviorState();
  }

  clamp(val) {
    return Math.max(METRIC_LIMITS.MIN, Math.min(METRIC_LIMITS.MAX, Math.round(val)));
  }

  // Update metrics safely
  updateMetrics(delta = {}) {
    if (delta.hunger !== undefined) this.hunger = this.clamp(this.hunger + delta.hunger);
    if (delta.happiness !== undefined) this.happiness = this.clamp(this.happiness + delta.happiness);
    if (delta.affection !== undefined) this.affection = this.clamp(this.affection + delta.affection);
    if (delta.energy !== undefined) this.energy = this.clamp(this.energy + delta.energy);
    if (delta.stress !== undefined) this.stress = this.clamp(this.stress + delta.stress);

    this.evaluateBehaviorState();
  }

  // Core State Machine Evaluation Rules
  evaluateBehaviorState() {
    if (this.stress >= 70) {
      this.currentState = BEHAVIOR_STATES.ANGRY;
    } else if (this.currentState === BEHAVIOR_STATES.STARTLED) {
      // Startled state maintained transiently via timeout
    } else if (this.currentState === BEHAVIOR_STATES.SLEEPING) {
      if (this.energy >= 95 || (!this.isNightMode && this.energy >= 80)) {
        this.currentState = BEHAVIOR_STATES.IDLE;
      }
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

  // Action: Feed Cat
  feedCat() {
    if (this.currentState === BEHAVIOR_STATES.SLEEPING) {
      this.updateMetrics({ stress: +25 });
      this.currentState = BEHAVIOR_STATES.ANGRY;
      return { success: false, reason: 'SLEEPING_DISTURBED' };
    }

    if (this.hunger <= 15) {
      // Rejection: Cat is full
      this.updateMetrics({ stress: +15 });
      return { success: false, reason: 'FULL' };
    }

    // Success Feed
    this.updateMetrics({ hunger: -30, affection: +3, happiness: +10 });
    return { success: true, reason: 'NORMAL' };
  }

  // Action: Pet Cat
  petCat(isLong = false) {
    const now = Date.now();
    this.lastPetTimes = this.lastPetTimes.filter(t => now - t < 3000);
    this.lastPetTimes.push(now);

    if (this.currentState === BEHAVIOR_STATES.SLEEPING) {
      this.updateMetrics({ stress: +30 });
      this.currentState = BEHAVIOR_STATES.ANGRY;
      return { success: false, reason: 'SLEEPING_DISTURBED' };
    }

    // Rapid petting (4+ times in 3 seconds) causes stress
    if (this.lastPetTimes.length >= 4 || this.stress >= 60) {
      this.updateMetrics({ stress: +20, happiness: -10 });
      this.currentState = BEHAVIOR_STATES.ANGRY;
      return { success: false, reason: 'OVERPETTED' };
    }

    // Success Pet
    const bonus = isLong ? 1.5 : 1.0;
    this.updateMetrics({ affection: +5 * bonus, happiness: +10 * bonus, stress: -5 });
    return { success: true, reason: 'NORMAL' };
  }

  // Action: Play with Cat
  playWithCat() {
    if (this.currentState === BEHAVIOR_STATES.SLEEPING) {
      this.updateMetrics({ stress: +30 });
      this.currentState = BEHAVIOR_STATES.ANGRY;
      return { success: false, reason: 'SLEEPING_DISTURBED' };
    }

    if (this.energy <= 25) {
      // Rejection: Too tired
      this.updateMetrics({ stress: +10 });
      return { success: false, reason: 'TIRED' };
    }

    // Success Play
    this.updateMetrics({ happiness: +20, energy: -20, hunger: +10 });
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
    this.isNightMode = isDark;
    if (isDark) {
      this.currentState = BEHAVIOR_STATES.SLEEPING;
      this.updateMetrics({ energy: +10 });
    } else if (this.currentState === BEHAVIOR_STATES.SLEEPING) {
      this.currentState = BEHAVIOR_STATES.IDLE;
    }
  }

  // Environment: Ultrasonic proximity approach
  handleApproach(isFast) {
    if (isFast) {
      this.currentState = BEHAVIOR_STATES.STARTLED;
      this.updateMetrics({ stress: +15, happiness: -10 });
      setTimeout(() => {
        if (this.currentState === BEHAVIOR_STATES.STARTLED) {
          this.evaluateBehaviorState();
        }
      }, 3000);
      return { success: true, reason: 'STARTLED' };
    } else {
      this.updateMetrics({ happiness: +10, affection: +2 });
      return { success: true, reason: 'CURIOUS' };
    }
  }

  // Tick: Time Decay (30s)
  processTick() {
    if (this.currentState === BEHAVIOR_STATES.SLEEPING) {
      this.updateMetrics({ energy: +10, stress: -5 });
    } else {
      this.updateMetrics({ hunger: +3, energy: -2, stress: -1 });
    }
  }
}
