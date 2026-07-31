/**
 * Cat Room - Decoration Drawer
 * UI matches the NABI MEOW reference: 9-section catalog grid with
 * category headers, 3-per-row item cards, lock badges.
 */

import { ROOM_SLOTS, ITEM_CATALOG } from '../config.js';
import { ToastManager } from './toast.js';

export class DecorationDrawer {
  constructor(storageManager, onRoomUpdate) {
    this.storageManager = storageManager;
    this.onRoomUpdate = onRoomUpdate;
    this.activeSlotId = 'wallpaper';

    this.backdrop      = document.getElementById('drawerBackdrop');
    this.tabsContainer = document.getElementById('drawerSlotTabs');
    this.itemsGrid     = document.getElementById('drawerItemsGrid');
    this.btnClose      = document.getElementById('btnCloseDrawer');
    this.btnOpen       = document.getElementById('btnOpenDecoration');

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

    // Find active slot info
    const slot = ROOM_SLOTS.find(s => s.id === this.activeSlotId);
    const catalogItems = ITEM_CATALOG[this.activeSlotId] || [];
    const equippedId   = data.roomSlots[this.activeSlotId];

    // Section header like reference: "♥ 1. Wallpaper (3) ♥"
    const slotIndex = ROOM_SLOTS.findIndex(s => s.id === this.activeSlotId) + 1;
    const header = document.createElement('div');
    header.className = 'drawer-section-header';
    header.textContent = `♥ ${slotIndex}. ${slot?.label} (${catalogItems.length}) ♥`;
    this.itemsGrid.appendChild(header);

    // Items row
    const row = document.createElement('div');
    row.className = 'drawer-items-row';

    catalogItems.forEach(item => {
      const isUnlocked = item.default || unlockedSet.has(item.id);
      const isEquipped = equippedId === item.id;

      const card = document.createElement('div');
      card.className = `drawer-item-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}`;

      card.innerHTML = `
        <div class="drawer-item-icon">${item.icon}</div>
        <div class="drawer-item-name">${item.name}</div>
        ${isEquipped ? '<div class="drawer-item-badge equipped-badge">✓ 착용 중</div>' : ''}
        ${!isUnlocked ? `<div class="drawer-item-badge lock-badge">🔒 해금 필요</div>` : ''}
      `;

      card.addEventListener('click', () => {
        if (!isUnlocked) {
          ToastManager.show(`🔒 ${this.getUnlockHint(item.unlockCondition)}`);
          return;
        }
        // Equip: update storage and trigger room re-render
        const freshData = this.storageManager.loadData();
        freshData.roomSlots[this.activeSlotId] = item.id;
        this.storageManager.saveData(freshData);
        ToastManager.show(`✨ ${item.name} 배치 완료!`);
        this.renderItems();
        if (this.onRoomUpdate) this.onRoomUpdate(freshData.roomSlots);
      });

      row.appendChild(card);
    });

    this.itemsGrid.appendChild(row);
  }

  getUnlockHint(cond) {
    if (!cond) return '업적 달성 필요';
    const map = {
      'feedCount:1':  '첫 밥 주기 달성',
      'feedCount:10': '밥 주기 10회 달성',
      'affection:30': '친밀도 30 달성',
      'affection:40': '친밀도 40 달성',
      'affection:50': '친밀도 50 달성',
      'affection:60': '친밀도 60 달성',
      'petCount:5':   '쓰다듬기 5회 달성',
      'petCount:10':  '쓰다듬기 10회 달성',
      'playCount:5':  '놀아주기 5회 달성',
      'playCount:10': '놀아주기 10회 달성',
      'captureCount:1': '사진 캡처 1회 달성',
      'captureCount:2': '사진 캡처 2회 달성',
      'captureCount:3': '사진 캡처 3회 달성',
      'arduinoConnected:true': 'Arduino 연동 달성'
    };
    return map[cond] || '특수 조건 달성 필요';
  }
}
