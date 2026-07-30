/**
 * Cat Room - Care Control Panel UI Component
 */

export class CarePanel {
  constructor(eventDispatcher) {
    this.eventDispatcher = eventDispatcher;
    this.initListeners();
  }

  initListeners() {
    const btnFeed = document.getElementById('btnCareFeed');
    const btnPet = document.getElementById('btnCarePet');
    const btnPlay = document.getElementById('btnCarePlay');
    const btnSleep = document.getElementById('btnCareSleep');

    if (btnFeed) btnFeed.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'FEED', source: 'UI' }));
    if (btnPet) btnPet.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'PET_SHORT', source: 'UI' }));
    if (btnPlay) btnPlay.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'PLAY', source: 'UI' }));
    if (btnSleep) btnSleep.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'SLEEP', source: 'UI' }));

    // Keyboard Shortcuts (1, 2, 3, 4)
    window.addEventListener('keydown', (e) => {
      if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }
      if (e.key === '1') this.eventDispatcher.dispatch({ type: 'FEED', source: 'KEYBOARD' });
      if (e.key === '2') this.eventDispatcher.dispatch({ type: 'PET_SHORT', source: 'KEYBOARD' });
      if (e.key === '3') this.eventDispatcher.dispatch({ type: 'PLAY', source: 'KEYBOARD' });
      if (e.key === '4') this.eventDispatcher.dispatch({ type: 'SLEEP', source: 'KEYBOARD' });
    });
  }
}
