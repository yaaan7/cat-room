/**
 * Cat Room - Virtual Sensor Test Mode Component
 */

export class VirtualSensorPanel {
  constructor(eventDispatcher) {
    this.eventDispatcher = eventDispatcher;
    this.init();
  }

  init() {
    const btnSlow = document.getElementById('vbtnSlowApproach');
    const btnFast = document.getElementById('vbtnFastApproach');
    const btnLeft = document.getElementById('vbtnPersonLeft');
    const btnPetShort = document.getElementById('vbtnPetShort');
    const btnPetLong = document.getElementById('vbtnPetLong');
    const btnFeed = document.getElementById('vbtnFeed');
    const btnBright = document.getElementById('vbtnLightBright');
    const btnDark = document.getElementById('vbtnLightDark');

    if (btnSlow) btnSlow.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'APPROACH_SLOW', source: 'VIRTUAL' }));
    if (btnFast) btnFast.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'APPROACH_FAST', source: 'VIRTUAL' }));
    if (btnLeft) btnLeft.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'PERSON_LEFT', source: 'VIRTUAL' }));
    if (btnPetShort) btnPetShort.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'PET_SHORT', source: 'VIRTUAL' }));
    if (btnPetLong) btnPetLong.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'PET_LONG', duration: 2500, source: 'VIRTUAL' }));
    if (btnFeed) btnFeed.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'FEED', source: 'VIRTUAL' }));
    if (btnBright) btnBright.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'LIGHT_BRIGHT', source: 'VIRTUAL' }));
    if (btnDark) btnDark.addEventListener('click', () => this.eventDispatcher.dispatch({ type: 'LIGHT_DARK', source: 'VIRTUAL' }));
  }
}
