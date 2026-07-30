/**
 * Cat Room - Onboarding & Cat Naming Modal Component
 */

export class OnboardingModal {
  constructor(storageManager, onSaveCallback) {
    this.storageManager = storageManager;
    this.onSaveCallback = onSaveCallback;

    this.backdrop = document.getElementById('modalOnboardingBackdrop');
    this.inputName = document.getElementById('inputCatName');
    this.btnSave = document.getElementById('btnSaveCatName');

    this.init();
  }

  init() {
    if (this.btnSave) {
      this.btnSave.addEventListener('click', () => this.save());
    }
    if (this.inputName) {
      this.inputName.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.save();
      });
    }
  }

  show(currentName = '나비') {
    if (this.inputName) this.inputName.value = currentName;
    if (this.backdrop) this.backdrop.classList.add('active');
  }

  hide() {
    if (this.backdrop) this.backdrop.classList.remove('active');
  }

  save() {
    const val = this.inputName ? this.inputName.value.trim() : '';
    if (!val) {
      alert('고양이 이름을 입력해 주세요!');
      return;
    }
    if (val.length > 12) {
      alert('이름은 최대 12자까지 입력할 수 있습니다.');
      return;
    }

    const data = this.storageManager.loadData();
    data.catProfile.name = val;
    data.flags.isFirstVisit = false;
    this.storageManager.saveData(data);

    this.hide();
    if (this.onSaveCallback) this.onSaveCallback(val);
  }
}
