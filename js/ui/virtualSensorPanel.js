/**
 * Cat Room - Virtual Sensor Test Mode Component
 */

export class VirtualSensorPanel {
  constructor(eventDispatcher) {
    this.eventDispatcher = eventDispatcher;
    this.init();
  }

  init() {
    const btnFeed = document.getElementById('vbtnFeed');
    const btnPetShort = document.getElementById('vbtnPetShort');
    const btnPetLong = document.getElementById('vbtnPetLong');
    const btnSlow = document.getElementById('vbtnSlowApproach');
    const btnFast = document.getElementById('vbtnFastApproach');
    const btnLeft = document.getElementById('vbtnPersonLeft');
    const btnBright = document.getElementById('vbtnLightBright');
    const btnDark = document.getElementById('vbtnLightDark');

    if (btnFeed) btnFeed.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'FEED', source: 'VIRTUAL' }));
    if (btnPetShort) btnPetShort.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'PET_SHORT', duration: 500, source: 'VIRTUAL' }));
    if (btnPetLong) btnPetLong.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'PET_LONG', duration: 2500, source: 'VIRTUAL' }));
    if (btnSlow) btnSlow.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'APPROACH_SLOW', distance: 35, source: 'VIRTUAL' }));
    if (btnFast) btnFast.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'APPROACH_FAST', distance: 15, source: 'VIRTUAL' }));
    if (btnLeft) btnLeft.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'PERSON_LEFT', source: 'VIRTUAL' }));
    if (btnBright) btnBright.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'LIGHT_BRIGHT', value: 450, source: 'VIRTUAL' }));
    if (btnDark) btnDark.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'LIGHT_DARK', value: 120, source: 'VIRTUAL' }));
  }
}
