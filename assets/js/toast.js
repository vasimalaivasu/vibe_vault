/**
 * VibeVault - Neon Toast Notification System
 * Accessible, dynamic toast manager supporting multiple positions, types and auto-dismissal.
 */

const Toast = {
  container: null,

  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.id = 'vox-toast-container';
    this.container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4';
    this.container.setAttribute('aria-live', 'polite');
    this.container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(this.container);
  },

  isLightMode() {
    try {
      const root = document.documentElement;
      const body = document.body;
      const themeAttr = root.getAttribute('data-theme') || (body && body.getAttribute('data-theme'));
      if (themeAttr === 'light') return true;
      if (themeAttr === 'dark') return false;
      if (root.classList.contains('light') || (body && body.classList.contains('light'))) return true;
      if (root.classList.contains('dark') || (body && body.classList.contains('dark'))) return false;
      if (window.StorageManager && typeof window.StorageManager.getTheme === 'function') {
        return window.StorageManager.getTheme() === 'light';
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  show({ title, message, type = 'info', duration = 4000, icon = null }) {
    this.init();

    const isLight = this.isLightMode();
    const toast = document.createElement('div');
    toast.className = `vox-toast vox-toast-${type} ${isLight ? 'vox-toast-light' : 'vox-toast-dark'} pointer-events-auto transform translate-y-4 opacity-0 transition-all duration-300 ease-out flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl text-sm`;

    // Theme color variants
    let borderClass = '';
    let iconClass = '';
    let titleClass = '';
    let messageClass = '';
    let closeClass = '';

    if (isLight) {
      // Light Mode Palette (Crisp white glass, high-contrast dark text, vibrant badges)
      if (type === 'success') {
        borderClass = 'border-emerald-300 bg-white/95 text-slate-800 shadow-[0_12px_32px_rgba(16,185,129,0.18)]';
        iconClass = icon || 'bi-check-circle-fill text-emerald-600 text-lg';
        titleClass = 'text-emerald-950 font-bold';
      } else if (type === 'error') {
        borderClass = 'border-rose-300 bg-white/95 text-slate-800 shadow-[0_12px_32px_rgba(244,63,94,0.18)]';
        iconClass = icon || 'bi-exclamation-octagon-fill text-rose-600 text-lg';
        titleClass = 'text-rose-950 font-bold';
      } else if (type === 'warning') {
        borderClass = 'border-amber-300 bg-white/95 text-slate-800 shadow-[0_12px_32px_rgba(245,158,11,0.18)]';
        iconClass = icon || 'bi-exclamation-triangle-fill text-amber-600 text-lg';
        titleClass = 'text-amber-950 font-bold';
      } else if (type === 'neon') {
        borderClass = 'border-pink-300 bg-white/95 text-slate-800 shadow-[0_12px_32px_rgba(236,72,153,0.2)]';
        iconClass = icon || 'bi-stars text-pink-600 text-lg';
        titleClass = 'text-pink-900 font-bold';
      } else {
        borderClass = 'border-cyan-300 bg-white/95 text-slate-800 shadow-[0_12px_32px_rgba(6,182,212,0.18)]';
        iconClass = icon || 'bi-info-circle-fill text-cyan-600 text-lg';
        titleClass = 'text-slate-900 font-bold';
      }
      messageClass = 'text-slate-600';
      closeClass = 'text-slate-400 hover:text-slate-800';
    } else {
      // Dark Mode Palette (Neon nightclub glassmorphism)
      if (type === 'success') {
        borderClass = 'border-emerald-500/40 bg-[#0c1a14]/95 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.25)]';
        iconClass = icon || 'bi-check-circle-fill text-emerald-400 text-lg';
        titleClass = 'text-emerald-100 font-bold';
      } else if (type === 'error') {
        borderClass = 'border-rose-500/40 bg-[#1e0a11]/95 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.25)]';
        iconClass = icon || 'bi-exclamation-octagon-fill text-rose-400 text-lg';
        titleClass = 'text-rose-100 font-bold';
      } else if (type === 'warning') {
        borderClass = 'border-amber-500/40 bg-[#1c1409]/95 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.25)]';
        iconClass = icon || 'bi-exclamation-triangle-fill text-amber-400 text-lg';
        titleClass = 'text-amber-100 font-bold';
      } else if (type === 'neon') {
        borderClass = 'border-pink-500/50 bg-[#140b22]/95 text-pink-100 shadow-[0_0_25px_rgba(236,72,153,0.35)]';
        iconClass = icon || 'bi-stars text-pink-400 text-lg';
        titleClass = 'text-white font-bold';
      } else {
        borderClass = 'border-cyan-500/40 bg-[#081525]/95 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.25)]';
        iconClass = icon || 'bi-info-circle-fill text-cyan-400 text-lg';
        titleClass = 'text-white font-bold';
      }
      messageClass = 'text-slate-300';
      closeClass = 'text-slate-400 hover:text-white';
    }

    toast.className += ` ${borderClass}`;

    toast.innerHTML = `
      <div class="flex-shrink-0 mt-0.5">
        <i class="toast-icon bi ${iconClass}"></i>
      </div>
      <div class="flex-1">
        ${title ? `<h4 class="toast-title text-sm tracking-wide mb-0.5 ${titleClass}">${title}</h4>` : ''}
        <p class="toast-message text-xs opacity-90 leading-relaxed ${messageClass}">${message || ''}</p>
      </div>
      <button class="toast-close text-xs transition-opacity p-1 ml-2 ${closeClass}" aria-label="Close notification">
        <i class="bi bi-x-lg"></i>
      </button>
    `;

    this.container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-4', 'opacity-0');
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', dismiss);
    }

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  },

  success(message, title = 'Success') {
    this.show({ title, message, type: 'success' });
  },

  error(message, title = 'Error') {
    this.show({ title, message, type: 'error' });
  },

  warning(message, title = 'Warning') {
    this.show({ title, message, type: 'warning' });
  },

  info(message, title = 'Notice') {
    this.show({ title, message, type: 'info' });
  },

  neon(message, title = 'Party Alert! 🎤') {
    this.show({ title, message, type: 'neon' });
  }
};

if (typeof window !== 'undefined') {
  window.Toast = Toast;
}
