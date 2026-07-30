/**
 * Cat Room - Main Application Bootstrap & Controller
 */

import { GAME_CONFIG, STATE_TAGS } from './config.js';
import { StorageManager } from './state/storage.js';
import { CatState } from './state/catState.js';
import { GameEventDispatcher } from './engine/dispatcher.js';
import { CatRenderer } from './graphics/catRenderer.js';
import { RoomRenderer } from './graphics/roomRenderer.js';
import { CarePanel } from './ui/carePanel.js';
import { DecorationDrawer } from './ui/decorationDrawer.js';
import { VirtualSensorPanel } from './ui/virtualSensorPanel.js';
import { OnboardingModal } from './ui/onboardingModal.js';
import { WebSerialManager } from './serial/webSerialManager.js';
import { CaptureManager } from './capture/captureManager.js';
import { ToastManager } from './ui/toast.js';

class CatRoomApp {
  constructor() {
    this.storageData = StorageManager.loadData();
    this.catState = new CatState({
      name: this.storageData.catProfile.name,
      ...this.storageData.metrics,
      currentState: this.storageData.currentState
    });

    this.currentSpeechText = "반가워요! 당신의 관심이 필요해요.";

    this.dispatcher = new GameEventDispatcher(
      this.catState,
      StorageManager,
      (updatePayload) => this.handleGameUpdate(updatePayload)
    );

    this.serialManager = new WebSerialManager(
      this.dispatcher,
      (isConnected, msg) => this.handleSerialStatus(isConnected, msg)
    );

    this.initUI();
    this.startTickLoop();
  }

  initUI() {
    // Care Panel & Virtual Panel
    new CarePanel(this.dispatcher);
    new VirtualSensorPanel(this.dispatcher);

    // Decoration Drawer
    this.drawer = new DecorationDrawer(StorageManager, (updatedSlots) => {
      this.storageData.roomSlots = updatedSlots;
      this.renderRoom();
    });

    // Onboarding Modal
    this.onboarding = new OnboardingModal(StorageManager, (newName) => {
      this.catState.name = newName;
      this.updateCatNameDisplay();
      ToastManager.show(`✨ 고양이 이름이 '${newName}'(으)로 설정되었습니다!`);
    });

    // Check First Visit
    if (this.storageData.flags?.isFirstVisit) {
      this.onboarding.show(this.catState.name);
    }

    // Name Badge Click -> Edit Name
    const badge = document.getElementById('catNameBadge');
    if (badge) {
      badge.addEventListener('click', () => this.onboarding.show(this.catState.name));
    }

    // Web Serial Connect Button
    const serialBtn = document.getElementById('btnSerialConnect');
    if (serialBtn) {
      serialBtn.addEventListener('click', () => {
        if (this.serialManager.isConnected) {
          this.serialManager.disconnect();
        } else {
          this.serialManager.connect();
        }
      });
    }

    // Photo Card Capture Button
    const captureBtn = document.getElementById('btnCaptureRoom');
    if (captureBtn) {
      captureBtn.addEventListener('click', async () => {
        ToastManager.show('📸 방 포토 카드를 생성하는 중...');
        const tag = STATE_TAGS[this.catState.currentState]?.label || '💬 평온함';
        await CaptureManager.captureRoomAndDownload(this.catState.name, tag, this.currentSpeechText);
        
        // Increment capture counter for item unlocks
        this.dispatcher.incrementCounter('captureCount');
        this.dispatcher.checkUnlockableItems();
        ToastManager.show('💾 이미지 저장 완료!');
      });
    }

    // Data Reset Button
    const resetBtn = document.getElementById('btnResetData');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('정말로 모든 고양이 상태 및 꾸미기 데이터를 초기화하시겠습니까?')) {
          StorageManager.clearData();
          location.reload();
        }
      });
    }

    this.updateCatNameDisplay();
    this.renderRoom();
    this.updateHUD();
  }

  updateCatNameDisplay() {
    const badge = document.getElementById('catNameBadge');
    if (badge) badge.textContent = `🐱 ${this.catState.name}`;
  }

  handleGameUpdate(payload) {
    if (payload.reactionText) {
      this.currentSpeechText = payload.reactionText;
      const bubble = document.getElementById('speechBubbleText');
      if (bubble) bubble.textContent = payload.reactionText;
    }

    // Auto-save State
    this.storageData.metrics = {
      hunger: this.catState.hunger,
      happiness: this.catState.happiness,
      affection: this.catState.affection,
      energy: this.catState.energy,
      stress: this.catState.stress
    };
    this.storageData.currentState = this.catState.currentState;
    StorageManager.saveData(this.storageData);

    this.renderRoom();
    this.updateHUD();
  }

  handleSerialStatus(isConnected, msg) {
    const dot = document.getElementById('serialStatusDot');
    const label = document.getElementById('serialStatusText');

    if (dot) {
      dot.className = `status-dot ${isConnected ? 'connected' : 'disconnected'}`;
    }
    if (label) {
      label.textContent = msg;
    }

    if (isConnected) {
      this.storageData.flags.hasConnectedArduino = true;
      StorageManager.saveData(this.storageData);
      this.dispatcher.checkUnlockableItems();
      ToastManager.show('⚡ Arduino UNO 연동 성공! 회로 장난감이 해금되었습니다.');
    } else {
      ToastManager.show(`🔌 ${msg}`);
    }
  }

  renderRoom() {
    const container = document.getElementById('roomCanvasContainer');
    if (!container) return;

    const catSvg = CatRenderer.renderSvg(this.catState.currentState);
    const roomSvg = RoomRenderer.renderRoomSvg(this.storageData.roomSlots, catSvg);

    container.innerHTML = roomSvg;
  }

  updateHUD() {
    const tagInfo = STATE_TAGS[this.catState.currentState] || STATE_TAGS.IDLE;
    const behaviorTagEl = document.getElementById('catBehaviorTag');
    if (behaviorTagEl) {
      behaviorTagEl.textContent = tagInfo.label;
      behaviorTagEl.style.color = tagInfo.color;
    }

    this.setMetricBar('barHunger', 'valHunger', this.catState.hunger);
    this.setMetricBar('barHappiness', 'valHappiness', this.catState.happiness);
    this.setMetricBar('barAffection', 'valAffection', this.catState.affection);
    this.setMetricBar('barEnergy', 'valEnergy', this.catState.energy);
    this.setMetricBar('barStress', 'valStress', this.catState.stress);
  }

  setMetricBar(barId, valId, value) {
    const bar = document.getElementById(barId);
    const val = document.getElementById(valId);
    if (bar) bar.style.width = `${value}%`;
    if (val) val.textContent = `${value} / 100`;
  }

  startTickLoop() {
    setInterval(() => {
      this.catState.processTick();
      this.handleGameUpdate({ reactionText: null });
    }, GAME_CONFIG.TICK_INTERVAL_MS);
  }
}

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.catApp = new CatRoomApp();
});
