/**
 * VibeVault - Global App Controller
 * Manages quick availability widget, animated statistics counters,
 * interactive song catalog filter chips, photo lightbox modal,
 * FAQ accordions, room detail modals, and global favorite heart syncing.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroAvailabilityWidget();
  initAnimatedCounters();
  initFaqAccordions();
  initSongCatalogFilters();
  initLightbox();
  initGlobalHeartButtons();
  initAuthRequiredLinksGuard();
});

// -------------------------------------------------------------
// 1. HERO QUICK AVAILABILITY WIDGET
// -------------------------------------------------------------
function initHeroAvailabilityWidget() {
  const form = document.getElementById('heroAvailabilityForm');
  if (!form) return;

  // Set default date to tomorrow
  const dateInput = document.getElementById('heroDateInput');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = dateInput ? dateInput.value : '';
    const roomTier = document.getElementById('heroCapacitySelect') ? document.getElementById('heroCapacitySelect').value : 'standard';
    const guests = document.getElementById('heroGuestsSelect') ? document.getElementById('heroGuestsSelect').value : '4';

    if (window.Toast) {
      window.Toast.neon('Checking live stage availability...');
    }

    // Redirect to dashboard booking with query parameters prefilled (or login if unauthenticated)
    setTimeout(() => {
      const targetUrl = `dashboard.html?date=${encodeURIComponent(date)}&guests=${encodeURIComponent(guests)}#book`;
      const user = window.StorageManager ? window.StorageManager.getCurrentUser() : null;
      if (!user) {
        window.location.href = `login.html?redirect=${encodeURIComponent(targetUrl)}`;
      } else {
        window.location.href = targetUrl;
      }
    }, 300);
  });
}

// -------------------------------------------------------------
// 2. ANIMATED STATISTICS COUNTERS
// -------------------------------------------------------------
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        const step = (currentTime) => {
          const progress = Math.min((currentTime - startTime) / duration, 1);
          // Easing: easeOutExpo
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = Math.floor(eased * target);

          el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        };

        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

// -------------------------------------------------------------
// 3. FAQ ACCORDION
// -------------------------------------------------------------
function initFaqAccordions() {
  const triggers = document.querySelectorAll('.faq-trigger');
  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.faq-item');
      if (!parent) return;

      const content = parent.querySelector('.faq-content');
      const icon = btn.querySelector('.faq-icon');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close sibling items in this group
      const group = parent.closest('.faq-group') || document;
      group.querySelectorAll('.faq-item').forEach(item => {
        if (item !== parent) {
          const itemBtn = item.querySelector('.faq-trigger');
          const itemContent = item.querySelector('.faq-content');
          const itemIcon = item.querySelector('.faq-icon');
          if (itemBtn) itemBtn.setAttribute('aria-expanded', 'false');
          if (itemContent) itemContent.classList.add('hidden');
          if (itemIcon) itemIcon.style.transform = 'rotate(0deg)';
        }
      });

      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        if (content) content.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      } else {
        btn.setAttribute('aria-expanded', 'true');
        if (content) content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

// -------------------------------------------------------------
// 4. SONG CATALOG FILTER CHIPS & SEARCH
// -------------------------------------------------------------
const SAMPLE_SONGS = [
  { title: 'Levitating', artist: 'Dua Lipa', genre: 'pop', lang: 'english', badge: 'Trending Top 10' },
  { title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'rock', lang: 'english', badge: 'All-Time Legend' },
  { title: 'Dynamite', artist: 'BTS', genre: 'kpop', lang: 'korean', badge: '100M+ Views' },
  { title: 'God\'s Plan', artist: 'Drake', genre: 'hiphop', lang: 'english', badge: 'Crowd Hype' },
  { title: 'Don\'t Stop Believin\'', artist: 'Journey', genre: 'rock', lang: 'english', badge: 'Squad Anthem' },
  { title: 'Cruel Summer', artist: 'Taylor Swift', genre: 'pop', lang: 'english', badge: 'Top Requested' },
  { title: 'Chaiyya Chaiyya', artist: 'Sukhwinder Singh / A.R. Rahman', genre: 'bollywood', lang: 'hindi', badge: 'High Energy' },
  { title: 'Gurenge', artist: 'LiSA (Demon Slayer OP)', genre: 'anime', lang: 'japanese', badge: 'Anime Hit' },
  { title: 'Blinding Lights', artist: 'The Weeknd', genre: 'pop', lang: 'english', badge: 'Synthwave' },
  { title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', genre: 'latin', lang: 'spanish', badge: 'Latin Classic' },
  { title: 'Hotel California', artist: 'Eagles', genre: 'rock', lang: 'english', badge: 'Classic Reverb' },
  { title: 'How You Like That', artist: 'BLACKPINK', genre: 'kpop', lang: 'korean', badge: 'K-Pop Queen' }
];

function initSongCatalogFilters() {
  const chips = document.querySelectorAll('.song-filter-chip');
  const searchInput = document.getElementById('songSearchInput');
  const listContainer = document.getElementById('songCatalogResults');

  if (!listContainer) return;

  let activeGenre = 'all';
  let searchTerm = '';

  const renderSongs = () => {
    let filtered = SAMPLE_SONGS;
    if (activeGenre !== 'all') {
      filtered = filtered.filter(s => s.genre === activeGenre);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="col-span-full py-8 text-center text-slate-500 text-xs">
          No songs found. Over 120,000+ tracks are available on the in-room iPad touchscreen!
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(song => `
      <div class="glass-panel p-3.5 rounded-2xl border border-purple-800/40 hover:border-pink-500/50 transition flex items-center justify-between gap-3 group">
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <div class="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center text-pink-400 group-hover:bg-pink-600 group-hover:text-white transition shrink-0">
            <i class="bi bi-music-note-beamed text-lg"></i>
          </div>
          <div class="min-w-0 flex-1">
            <h5 class="font-display font-bold text-white text-sm group-hover:text-pink-300 transition whitespace-nowrap truncate" title="${song.title}">${song.title}</h5>
            <p class="text-xs text-slate-400 whitespace-nowrap truncate" title="${song.artist}">${song.artist}</p>
          </div>
        </div>
        <div class="text-right shrink-0">
          <span class="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-1 rounded-full whitespace-nowrap inline-block">${song.badge}</span>
        </div>
      </div>
    `).join('');
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => {
        c.classList.remove('bg-pink-600', 'text-white', 'border-pink-500');
        c.classList.add('bg-purple-950/60', 'text-slate-300', 'border-purple-800/50');
      });
      chip.classList.remove('bg-purple-950/60', 'text-slate-300', 'border-purple-800/50');
      chip.classList.add('bg-pink-600', 'text-white', 'border-pink-500');

      activeGenre = chip.getAttribute('data-genre') || 'all';
      renderSongs();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      renderSongs();
    });
  }

  // Initial render
  renderSongs();
}

// -------------------------------------------------------------
// 5. LIGHTBOX PHOTO VIEWER
// -------------------------------------------------------------
function initLightbox() {
  const triggers = document.querySelectorAll('[data-lightbox-img]');
  if (triggers.length === 0) return;

  let modal = document.getElementById('voxLightboxModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'voxLightboxModal';
    modal.className = 'vox-lightbox';
    modal.innerHTML = `
      <div class="relative max-w-4xl max-h-[85vh] p-4 flex flex-col items-center">
        <button id="closeLightboxBtn" class="absolute -top-12 right-0 text-white text-3xl hover:text-pink-400 transition p-2">
          <i class="bi bi-x-lg"></i>
        </button>
        <img id="lightboxImgTarget" src="" alt="Party Venue" class="max-h-[80vh] w-auto rounded-2xl shadow-2xl object-contain border border-purple-800/50">
        <p id="lightboxCaption" class="text-xs text-slate-300 font-bold mt-3 text-center"></p>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const imgTarget = document.getElementById('lightboxImgTarget');
  const captionTarget = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('closeLightboxBtn');

  triggers.forEach(trig => {
    trig.addEventListener('click', (e) => {
      e.preventDefault();
      const src = trig.getAttribute('data-lightbox-img') || trig.getAttribute('src');
      const caption = trig.getAttribute('data-lightbox-title') || trig.getAttribute('alt') || 'VibeVault Venue Experience';
      
      if (imgTarget) imgTarget.src = src;
      if (captionTarget) captionTarget.textContent = caption;
      modal.classList.add('active');
    });
  });

  const closeModal = () => modal.classList.remove('active');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// -------------------------------------------------------------
// 6. GLOBAL HEART FAVORITE BUTTON SYNC
// -------------------------------------------------------------
function initGlobalHeartButtons() {
  document.addEventListener('click', (e) => {
    const heartBtn = e.target.closest('[data-favorite-room]');
    if (!heartBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const roomId = heartBtn.getAttribute('data-favorite-room');
    if (!window.StorageManager) return;

    const isAdded = window.StorageManager.toggleFavorite(roomId);
    const svg = heartBtn.querySelector('svg');
    const icon = heartBtn.querySelector('i');

    if (isAdded) {
      heartBtn.classList.add('is-favorite');
      heartBtn.setAttribute('title', 'Remove from Wishlist');
      if (svg) {
        svg.setAttribute('fill', 'currentColor');
        svg.classList.add('scale-125');
      }
      if (icon) {
        icon.className = 'bi bi-heart-fill scale-125 transition-transform';
      }
      if (window.Toast) window.Toast.neon('Room saved to your wishlist! 💖');
    } else {
      heartBtn.classList.remove('is-favorite');
      heartBtn.setAttribute('title', 'Add to Wishlist');
      if (svg) {
        svg.setAttribute('fill', 'none');
        svg.classList.add('scale-90');
      }
      if (icon) {
        icon.className = 'bi bi-heart scale-90 transition-transform';
      }
      if (window.Toast) window.Toast.info('Removed room from wishlist.');
    }

    setTimeout(() => {
      if (svg) svg.classList.remove('scale-125', 'scale-90');
      if (icon) icon.classList.remove('scale-125', 'scale-90');
    }, 250);
  });
}

// -------------------------------------------------------------
// 7. ROOM DETAILS MODAL
// -------------------------------------------------------------
function openRoomDetailsModal(roomId) {
  const room = (window.VOX_ROOMS || []).find(r => r.id === roomId);
  if (!room) return;

  let modal = document.getElementById('voxRoomDetailsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'voxRoomDetailsModal';
    document.body.appendChild(modal);
  }

  modal.className = 'fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl';
  modal.innerHTML = `
    <div class="glass-panel max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-purple-800/60 shadow-2xl space-y-6">
      
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-purple-800/40">
        <div>
          <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">${room.theme}</span>
          <h3 class="font-display font-black text-2xl text-white mt-0.5">${room.name}</h3>
        </div>
        <button onclick="document.getElementById('voxRoomDetailsModal').remove()" class="w-9 h-9 rounded-xl bg-purple-900/60 hover:bg-pink-600 text-white flex items-center justify-center transition">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Gallery Showcase -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="sm:col-span-2 h-64 rounded-2xl overflow-hidden">
          <img src="${room.gallery[0] || room.image}" alt="${room.name}" class="w-full h-full object-cover">
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-1 gap-3 h-64">
          <div class="h-full rounded-2xl overflow-hidden">
            <img src="${room.gallery[1] || room.image}" alt="${room.name}" class="w-full h-full object-cover">
          </div>
          <div class="h-full rounded-2xl overflow-hidden">
            <img src="${room.gallery[2] || room.image}" alt="${room.name}" class="w-full h-full object-cover">
          </div>
        </div>
      </div>

      <!-- Room Specs Bar -->
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/40">
          <span class="text-slate-500 text-[10px] uppercase font-bold block">Capacity</span>
          <span class="font-bold text-white text-sm">${room.capacityText}</span>
        </div>
        <div class="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/40">
          <span class="text-slate-500 text-[10px] uppercase font-bold block">Hourly Rate</span>
          <span class="font-display font-black text-pink-400 text-sm">$${room.pricePerHour}/hr</span>
        </div>
        <div class="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/40">
          <span class="text-slate-500 text-[10px] uppercase font-bold block">Guest Rating</span>
          <span class="font-bold text-amber-400 text-sm"><i class="bi bi-star-fill"></i> ${room.rating} (${room.reviewsCount})</span>
        </div>
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <h4 class="font-display font-bold text-white text-sm uppercase tracking-wider">Atmosphere & Design</h4>
        <p class="text-xs text-slate-300 leading-relaxed">${room.description}</p>
      </div>

      <!-- Amenities Grid -->
      <div class="space-y-3">
        <h4 class="font-display font-bold text-white text-sm uppercase tracking-wider">Suite Amenities</h4>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-300">
          ${room.amenities.map(a => `
            <div class="p-2.5 rounded-xl bg-purple-950/30 border border-purple-900/40 flex items-center gap-2">
              <i class="bi ${a.icon} text-cyan-400 text-sm"></i>
              <span>${a.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Equipment Hardware Specs -->
      <div class="space-y-2">
        <h4 class="font-display font-bold text-white text-sm uppercase tracking-wider">Audio & Video Hardware</h4>
        <ul class="space-y-1.5 text-xs text-slate-400">
          ${room.equipment.map(eq => `
            <li class="flex items-center gap-2">
              <i class="bi bi-check2-circle text-pink-400"></i> ${eq}
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- House Rules -->
      <div class="space-y-2">
        <h4 class="font-display font-bold text-white text-sm uppercase tracking-wider">Room Guidelines</h4>
        <ul class="space-y-1 text-xs text-slate-400">
          ${room.houseRules.map(hr => `
            <li class="flex items-center gap-2">
              <i class="bi bi-shield-check text-emerald-400"></i> ${hr}
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Modal Footer CTA -->
      <div class="pt-4 border-t border-purple-800/40 flex items-center justify-between gap-4">
        <div>
          <span class="text-xs text-slate-400 block">Starting at</span>
          <span class="font-display font-black text-2xl text-cyan-400">$${room.pricePerHour}</span>
          <span class="text-xs text-slate-400"> / hour</span>
        </div>
        <div class="flex items-center gap-3">
          <button onclick="document.getElementById('voxRoomDetailsModal').remove()" class="btn-neon-outline px-4 py-2.5 text-xs">
            Close
          </button>
          <a href="${window.StorageManager && window.StorageManager.getCurrentUser() ? `dashboard.html?roomId=${room.id}#book` : `login.html?redirect=${encodeURIComponent(`dashboard.html?roomId=${room.id}#book`)}`}" class="btn-neon-primary px-6 py-2.5 text-xs">
            <i class="bi bi-calendar-plus"></i> Book This Room
          </a>
        </div>
      </div>

    </div>
  `;
}

// -------------------------------------------------------------
// 7. GLOBAL AUTH GUARD FOR BOOKING & DASHBOARD ACCESS
// -------------------------------------------------------------
function initAuthRequiredLinksGuard() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="dashboard.html"]');
    if (!link) return;

    const user = window.StorageManager ? window.StorageManager.getCurrentUser() : null;
    if (!user) {
      e.preventDefault();
      const rawHref = link.getAttribute('href');
      const targetUrl = rawHref || 'dashboard.html#book';
      window.location.href = `login.html?redirect=${encodeURIComponent(targetUrl)}`;
    }
  });
}

// Global attach
if (typeof window !== 'undefined') {
  window.openRoomDetailsModal = openRoomDetailsModal;
  window.initAuthRequiredLinksGuard = initAuthRequiredLinksGuard;
}
