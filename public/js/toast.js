// Toast Notification Module for CampusConnect
const Toast = {
  show(type = 'info', title = '', message = '', duration = 4000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };

    const iconColor = {
      success: 'text-[#00B894]',
      error: 'text-[#ba1a1a]',
      warning: 'text-[#f39c12]',
      info: 'text-[#5341cd]'
    };

    toast.innerHTML = `
      <span class="material-symbols-outlined text-[24px] ${iconColor[type] || 'text-[#5341cd]'} flex-shrink-0" style="font-variation-settings: 'FILL' 1;">
        ${icons[type] || 'info'}
      </span>
      <div class="flex-1">
        ${title ? `<h4 class="font-bold text-sm text-[#171931] leading-tight mb-1">${title}</h4>` : ''}
        <p class="text-xs text-[#474554] leading-relaxed">${message}</p>
      </div>
      <button class="text-gray-400 hover:text-gray-700 transition-colors p-1" onclick="this.parentElement.remove()">
        <span class="material-symbols-outlined text-[16px]">close</span>
      </button>
    `;

    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }
  },

  success(title, message, duration) {
    this.show('success', title, message, duration);
  },

  error(title, message, duration) {
    this.show('error', title, message, duration);
  },

  info(title, message, duration) {
    this.show('info', title, message, duration);
  },

  warning(title, message, duration) {
    this.show('warning', title, message, duration);
  }
};

window.Toast = Toast;
