/**
 * Cat Room - In-Game Toast Notifications Manager
 * Displays beautiful notification cards above the Tamagotchi device shell.
 */

export class ToastManager {
  static show(message, duration = 2500) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      document.body.appendChild(container);
    }

    container.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = 'toast-center-card';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}
