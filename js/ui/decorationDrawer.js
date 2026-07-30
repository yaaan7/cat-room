/**
 * Cat Room - 9-Slot Room Decoration Drawer Component
 */

import { ROOM_SLOTS, ITEM_CATALOG } from '../config.js';
import { ToastManager } from './toast.js';

export class DecorationDrawer {
  constructor(storageManager, onRoomUpdate) {
    this.storageManager = storageManager;
    this.onRoomUpdate = onRoomUpdate;
    this.activeSlotId = 'wallpaper';

    this.backdrop = document.getElementById('drawerBackdrop');
    this.tabsContainer = document.getElementById('drawerSlotTabs');
    this.itemsGrid = document.getElementById('drawerItemsGrid');
    this.btnClose = document.getElementById('btnCloseDrawer');
    this.btnOpen = document.getElementById('btnOpenDecoration');

    this.init();
  }

  init() {
    if (this.btnOpen) this.btnOpen.addEventListener('click', () => this.open());
    if (this.btnClose) this.btnClose.addEventListener('click', () => this.close());
    if (this.backdrop) {
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) this.close();
      });
    }

    this.renderTabs();
  }

  open() {
    if (this.backdrop) this.backdrop.classList.add('active');
    this.renderItems();
  }

  close() {
    if (this.backdrop) this.backdrop.classList.remove('active');
  }

  renderTabs() {
    if (!this.tabsContainer) return;
    this.tabsContainer.innerHTML = '';

    ROOM_SLOTS.forEach(slot => {
      const btn = document.createElement('button');
      btn.className = `slot-tab-btn ${slot.id === this.activeSlotId ? 'active' : ''}`;
      btn.textContent = slot.label;
      btn.addEventListener('click', () => {
        this.activeSlotId = slot.id;
        this.renderTabs();
        this.renderItems();
      });
      this.tabsContainer.appendChild(btn);
    });
  }

  renderItems() {
    if (!this.itemsGrid) return;
    this.itemsGrid.innerHTML = '';

    const data = this.storageManager.loadData();
    const unlockedSet = new Set(data.unlockedItems || []);
    const equippedSlotValue = data.roomSlots[this.activeSlotId];

    const catalogItems = ITEM_CATALOG[this.activeSlotId] || [];

    catalogItems.forEach(item => {
      const card = document.createElement('div');
      const isUnlocked = item.default || unlockedSet.has(item.id);
      const isEquipped = equippedSlotValue === item.id;

      card.className = `item-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}`;

      card.innerHTML = `
        <div style="font-size:32px;">${item.icon}</div>
        <div style="font-size:13px; font-weight:600; text-align:center;">${item.name}</div>
        ${!isUnlocked ? `<span class="lock-badge">🔒</span>` : ''}
        ${isEquipped ? `<span style="font-size:11px; color:var(--success-color); font-weight:600;">✓ 착용 중</span>` : ''}
      `;

      card.addEventListener('click', () => {
        if (!isUnlocked) {
          ToastManager.show(`🔒 해금 필요: ${this.getUnlockHint(item.unlockCondition)}`);
          return;
        }

        // Equip Item
        data.roomSlots[this.activeSlotId] = item.id;
        this.storageManager.saveData(data);
        ToastManager.show(`✨ ${item.name} 배치 완료!`);
        this.renderItems();
        if (this.onRoomUpdate) this.onRoomUpdate(data.roomSlots);
      });

      this.itemsGrid.appendChild(card);
    });
  }

  getUnlockHint(cond) {
    if (!cond) return '업적 달성 필요';
    if (cond === 'feedCount:1') return '첫 밥 주기 달성';
    if (cond === 'feedCount:10') return '밥 주기 10회 달성';
    if (cond === 'affection:30') return '친밀도 30 달성';
    if (cond === 'affection:40') return '친밀도 40 달성';
    if (cond === 'affection:50') return '친밀도 50 달성';
    if (cond === 'affection:60') return '친밀도 60 달성';
    if (cond === 'petCount:5') return '쓰다듬기 5회 달성';
    if (cond === 'petCount:10') return '쓰다듬기 10회 달성';
    if (cond === 'playCount:5') return '놀아주기 5회 달성';
    if (cond === 'playCount:10') return '놀아주기 10회 달성';
    if (cond === 'captureCount:1') return '사진 캡처 1회 달성';
    if (cond === 'captureCount:2') return '사진 캡처 2회 달성';
    if (cond === 'captureCount:3') return '사진 캡처 3회 달성';
    if (cond === 'arduinoConnected:true') return 'Arduino 최초 1회 연동 달성';
    return '특수 조건 달성 필요';
  }
}
