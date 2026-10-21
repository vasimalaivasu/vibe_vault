/**
 * VibeVault - Unified Navigation Component
 * Provides responsive sticky navbar, active state highlighting, mobile offcanvas drawer,
 * theme toggle, RTL toggle, notification badge, and authentication status dropdown.
 */

document.addEventListener('DOMContentLoaded', () => {
  const mountPoint = document.getElementById('navbar-mount');
  if (!mountPoint) return;

  const currentUser = window.StorageManager ? window.StorageManager.getCurrentUser() : null;
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const unreadNotifs = window.StorageManager ? window.StorageManager.getNotifications().filter(n => !n.read).length : 0;
  const currentTheme = window.StorageManager ? window.StorageManager.getTheme() : 'light';
  const currentDir = window.StorageManager ? window.StorageManager.getDirection() : 'ltr';

  // Helper to determine active link classes
  const isLinkActive = (file) => (currentPath === file || (file === 'index.html' && (currentPath === '' || currentPath === '/')));
  const isHomeActive = isLinkActive('index.html') || isLinkActive('index2.html');
  const getNavLinkClass = (file) => isLinkActive(file)
    ? 'nav-item-pill active bg-gradient-to-r from-pink-600/30 to-purple-600/35 text-white font-bold border border-pink-500/40 shadow-[0_0_15px_rgba(255,0,127,0.25)]'
    : 'nav-item-pill text-slate-300 hover:text-white hover:bg-purple-900/30 border border-transparent';

  mountPoint.innerHTML = `
    <!-- Top Sticky Header -->
    <header id="mainNavbar" class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0b0914]/90 border-b border-purple-900/30 transition-all duration-300">
      <div class="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-4 xl:px-10 2xl:px-14 h-20 sm:h-22 flex items-center justify-between gap-2.5 sm:gap-4 lg:gap-3 xl:gap-6 2xl:gap-8">
        
        <!-- Brand Logo -->
        <a href="index.html" class="flex items-center gap-2.5 xl:gap-3.5 group focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-2xl p-1 flex-shrink-0">
          <div class="w-9 h-9 xl:w-11 xl:h-11 rounded-xl xl:rounded-2xl bg-gradient-to-tr from-pink-600 to-cyan-400 p-0.5 shadow-[0_0_18px_rgba(255,0,127,0.4)] group-hover:shadow-[0_0_24px_rgba(0,240,255,0.5)] transition-all duration-300">
            <div class="w-full h-full bg-[#0b0914] rounded-[10px] xl:rounded-[14px] flex items-center justify-center">
              <i class="bi bi-soundwave text-xl xl:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400"></i>
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-display font-black text-xl xl:text-2xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-pink-300 transition-all">VIBE<span class="text-neon-pink">VAULT</span></span>
            </div>
            <p class="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-0.5 hidden xl:block">Private Karaoke Suites</p>
          </div>
        </a>

        <!-- Desktop Navigation: Floating Capsule Island (Unbreakable Single-Line) -->
        <nav class="hidden lg:flex items-center p-0.5 lg:p-1 xl:p-1.5 rounded-full bg-purple-950/40 border border-purple-800/40 backdrop-blur-md shadow-inner text-xs xl:text-sm font-medium gap-0.5 lg:gap-1 xl:gap-2 whitespace-nowrap flex-nowrap shrink-0">
          
          <!-- Home Dropdown -->
          <div class="relative group/navhome flex-shrink-0" id="navHomeDropdownContainer">
            <button id="navHomeDropdownBtn" type="button" aria-haspopup="true" aria-expanded="false"
                    class="px-2.5 py-1.5 xl:px-4 xl:py-2 rounded-full transition-all duration-200 flex items-center gap-1 xl:gap-1.5 whitespace-nowrap flex-nowrap shrink-0 ${isHomeActive ? 'nav-item-pill active bg-gradient-to-r from-pink-600/30 to-purple-600/35 text-white font-bold border border-pink-500/40 shadow-[0_0_15px_rgba(255,0,127,0.25)]' : 'nav-item-pill text-slate-300 hover:text-white hover:bg-purple-900/30 border border-transparent'}">
              <i class="bi bi-house-door text-xs opacity-75 hidden xl:inline-block"></i>
              <span>Home</span>
              <i id="navHomeChevron" class="bi bi-chevron-down text-[10px] opacity-70 transition-transform duration-200 group-hover/navhome:rotate-180"></i>
            </button>

            <!-- Dropdown Menu with Seamless Hover Bridge -->
            <div id="navHomeDropdownMenu"
                 class="hidden group-hover/navhome:block hover:block absolute top-full left-0 pt-2 w-64 z-[70] animate-fadeIn before:absolute before:-top-2.5 before:left-0 before:right-0 before:h-3 before:content-['']">
              <div class="w-full rounded-2xl bg-[#140e29]/95 backdrop-blur-xl border border-purple-700/50 shadow-2xl p-2 text-xs">
                <a href="index.html" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-800/40 transition group/item ${isLinkActive('index.html') ? 'bg-purple-900/40 text-pink-400 font-bold' : 'text-slate-200'}">
                  <div class="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                    <i class="bi bi-house-door"></i>
                  </div>
                  <div>
                    <div class="font-bold text-white group-hover/item:text-pink-300 transition">Classic Lounge</div>
                    <div class="text-[10px] text-slate-400">Private Karaoke Suites</div>
                  </div>
                </a>
                <div class="border-t border-purple-800/30 my-1"></div>
                <a href="index2.html" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-800/40 transition group/item ${isLinkActive('index2.html') ? 'bg-purple-900/40 text-cyan-400 font-bold' : 'text-slate-200'}">
                  <div class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                    <i class="bi bi-stars"></i>
                  </div>
                  <div>
                    <div class="font-bold text-white group-hover/item:text-cyan-300 transition">VIP Nightlife</div>
                    <div class="text-[10px] text-slate-400">Concert Audio & Live Beats</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <a href="rooms.html" class="px-2.5 py-1.5 xl:px-4 xl:py-2 rounded-full transition-all duration-200 flex items-center gap-1 xl:gap-1.5 whitespace-nowrap flex-nowrap shrink-0 ${getNavLinkClass('rooms.html')}">
            <i class="bi bi-disc text-xs opacity-75 hidden xl:inline-block"></i>
            <span>Suites</span>
          </a>
          <a href="songs.html" class="px-2.5 py-1.5 xl:px-4 xl:py-2 rounded-full transition-all duration-200 flex items-center gap-1 xl:gap-1.5 whitespace-nowrap flex-nowrap shrink-0 ${getNavLinkClass('songs.html')}">
            <i class="bi bi-music-note-beamed text-xs opacity-75 hidden xl:inline-block"></i>
            <span>Songbook</span>
          </a>
          <a href="packages.html" class="px-2.5 py-1.5 xl:px-4 xl:py-2 rounded-full transition-all duration-200 flex items-center gap-1 xl:gap-1.5 whitespace-nowrap flex-nowrap shrink-0 ${getNavLinkClass('packages.html')}">
            <i class="bi bi-stars text-xs opacity-75 hidden xl:inline-block"></i>
            <span>Pricing</span>
          </a>
          <a href="blog.html" class="px-2.5 py-1.5 xl:px-4 xl:py-2 rounded-full transition-all duration-200 flex items-center gap-1 xl:gap-1.5 whitespace-nowrap flex-nowrap shrink-0 ${getNavLinkClass('blog.html')}">
            <i class="bi bi-journal-richtext text-xs opacity-75 hidden xl:inline-block"></i>
            <span>Blog</span>
          </a>
          <a href="contact.html" class="px-2.5 py-1.5 xl:px-4 xl:py-2 rounded-full transition-all duration-200 flex items-center gap-1 xl:gap-1.5 whitespace-nowrap flex-nowrap shrink-0 ${getNavLinkClass('contact.html')}">
            <i class="bi bi-envelope text-xs opacity-75 hidden xl:inline-block"></i>
            <span>Contact</span>
          </a>
        </nav>

        <!-- Right Controls: Compact Utility Group + Booking CTA + Profile Button (Last) -->
        <div class="hidden lg:flex items-center gap-1.5 lg:gap-2 xl:gap-3 flex-shrink-0 whitespace-nowrap">
          
          <!-- Unified Utility Pill (Theme + RTL) -->
          <div class="flex items-center bg-purple-950/40 border border-purple-800/40 rounded-full p-0.5 xl:p-1 backdrop-blur-md shadow-inner">
            <button id="themeToggleBtn" title="Toggle Dark/Light Mode" aria-label="Toggle Theme"
                    class="w-7 h-7 xl:w-8 xl:h-8 rounded-full text-slate-300 hover:text-cyan-400 hover:bg-purple-900/50 flex items-center justify-center transition-all">
              <i class="bi ${currentTheme === 'light' ? 'bi-moon-stars-fill text-amber-400' : 'bi-sun-fill text-yellow-300'} text-xs xl:text-sm"></i>
            </button>
            <span class="w-px h-3.5 bg-purple-800/60 mx-0.5"></span>
            <button id="rtlToggleBtn" title="Toggle RTL / LTR Direction" aria-label="Toggle Direction"
                    class="px-2 xl:px-2.5 h-7 xl:h-8 rounded-full text-[11px] xl:text-xs font-bold text-slate-300 hover:text-pink-400 hover:bg-purple-900/50 flex items-center justify-center gap-1 transition-all">
              <i class="bi bi-arrow-left-right text-[10px] xl:text-xs"></i>
              <span>${currentDir === 'rtl' ? 'LTR' : 'RTL'}</span>
            </button>
          </div>

          <!-- Primary Book CTA (Placed before Profile button) -->
          <a href="dashboard.html#book" class="btn-neon-primary px-3 py-1.5 xl:px-5 xl:py-2.5 rounded-full text-xs font-bold tracking-wide shadow-[0_0_20px_rgba(255,0,127,0.35)] hover:shadow-[0_0_30px_rgba(255,0,127,0.55)] flex items-center gap-1.5 xl:gap-2 whitespace-nowrap shrink-0">
            <i class="bi bi-calendar-plus text-xs xl:text-sm"></i>
            <span>Book a Room</span>
          </a>

          <!-- Profile / Auth Section (Moved to the LAST position, no name in button) -->
          ${currentUser ? `
            <div class="relative" id="userMenuContainer">
              <button id="userDropdownTrigger" title="${currentUser.name}" aria-label="User Profile" class="flex items-center gap-1 p-0.5 xl:p-1 rounded-full bg-purple-950/40 border border-purple-800/40 hover:border-pink-500/60 hover:bg-purple-900/40 transition-all text-xs xl:text-sm group whitespace-nowrap">
                <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}" 
                     alt="${currentUser.name}" class="w-7 h-7 xl:w-8 xl:h-8 rounded-full object-cover ring-2 ring-pink-500/50 group-hover:ring-pink-500 transition-all">
                <i class="bi bi-chevron-down text-[10px] text-slate-400 group-hover:text-white transition-transform px-1"></i>
              </button>
              
              <!-- Dropdown Menu -->
              <div id="userDropdownMenu" class="hidden absolute right-0 mt-3 w-60 rounded-2xl bg-[#140e29]/95 backdrop-blur-xl border border-purple-700/50 shadow-2xl p-2.5 z-50 text-sm animate-fadeIn">
                <div class="px-3 py-2 border-b border-purple-800/40 mb-1">
                  <p class="font-bold text-white">${currentUser.name}</p>
                  <p class="text-xs text-slate-400 truncate">${currentUser.email}</p>
                  <span class="inline-flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full">
                    <i class="bi bi-stars text-[10px]"></i> ${currentUser.membershipTier || 'Gold VIP Vocalist'}
                  </span>
                </div>
                <a href="dashboard.html" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-purple-800/40 hover:text-white transition">
                  <i class="bi bi-speedometer2 text-cyan-400"></i> Customer Dashboard
                </a>
                <a href="dashboard.html#reservations" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-purple-800/40 hover:text-white transition">
                  <i class="bi bi-calendar-check-fill text-pink-400"></i> My Reservations
                </a>
                <a href="dashboard.html#favorites" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-purple-800/40 hover:text-white transition">
                  <i class="bi bi-heart-fill text-rose-400"></i> Saved Rooms
                </a>
                <a href="dashboard.html#profile" class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-purple-800/40 hover:text-white transition">
                  <i class="bi bi-gear-fill text-purple-400"></i> Account Settings
                </a>
                <div class="border-t border-purple-800/40 my-1"></div>
                <button id="navLogoutBtn" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition text-left">
                  <i class="bi bi-box-arrow-right"></i> Sign Out
                </button>
              </div>
            </div>
          ` : `
            <a href="login.html" id="navSignInBtn" class="nav-signin-btn px-3 py-1.5 xl:px-4 xl:py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap">
              <i class="bi bi-person-fill text-xs mr-1"></i> Sign In
            </a>
          `}

        </div>

        <!-- Mobile Controls (Theme + Hamburger) -->
        <div class="flex items-center gap-2.5 lg:hidden">
          <button id="mobileThemeToggleBtn" aria-label="Toggle Theme" class="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-800/40 text-slate-300 flex items-center justify-center">
            <i class="bi ${currentTheme === 'light' ? 'bi-moon-stars-fill text-amber-400' : 'bi-sun-fill text-yellow-300'}"></i>
          </button>
          
          <button id="mobileMenuOpenBtn" aria-label="Open Navigation Menu" class="w-11 h-11 rounded-xl bg-pink-600/20 border border-pink-500/40 text-pink-400 flex items-center justify-center text-xl">
            <i class="bi bi-list"></i>
          </button>
        </div>

      </div>
    </header>

    <!-- Mobile Drawer Overlay -->
    <div id="mobileDrawerOverlay" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 hidden opacity-0 transition-opacity duration-300"></div>

    <!-- Mobile Drawer Content -->
    <div id="mobileDrawer" class="fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-[#0e0920] border-l border-purple-800/50 z-50 transform translate-x-full transition-transform duration-300 ease-out flex flex-col p-6 shadow-2xl overflow-y-auto">
      
      <!-- Drawer Header -->
      <div class="flex items-center justify-between pb-6 border-b border-purple-800/40">
        <div class="flex items-center gap-2">
          <i class="bi bi-soundwave text-2xl text-neon-pink"></i>
          <span class="font-display font-black text-xl text-white">VIBE<span class="text-neon-pink">VAULT</span></span>
        </div>
        <button id="mobileMenuCloseBtn" class="w-9 h-9 rounded-xl bg-purple-900/40 text-slate-300 hover:text-white flex items-center justify-center">
          <i class="bi bi-x-lg text-lg"></i>
        </button>
      </div>

      <!-- User Card in Mobile Drawer -->
      ${currentUser ? `
        <div class="my-4 p-3 rounded-2xl bg-purple-950/40 border border-purple-800/50 flex items-center gap-3">
          <img src="${currentUser.avatar}" alt="${currentUser.name}" class="w-10 h-10 rounded-xl object-cover ring-2 ring-pink-500">
          <div class="overflow-hidden">
            <p class="font-bold text-white text-sm truncate">${currentUser.name}</p>
            <p class="text-xs text-pink-400 font-medium">${currentUser.loyaltyPoints || 420} Points Available</p>
          </div>
        </div>
      ` : ''}

      <!-- Drawer Nav Links -->
      <nav class="flex-1 space-y-2 py-4">
        <!-- Home Submenu -->
        <div class="rounded-2xl bg-purple-950/40 border border-purple-800/40 p-2 space-y-1">
          <div class="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <i class="bi bi-house-door text-pink-400"></i>
            <span>Home Experiences</span>
          </div>
          <a href="index.html" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-900/30 transition ${isLinkActive('index.html') ? 'text-pink-400 font-bold bg-pink-500/10' : 'text-slate-200'}">
            <span class="flex items-center gap-2.5"><i class="bi bi-dot text-lg text-pink-400"></i> Classic Lounge</span>
            <i class="bi bi-chevron-right text-[10px] text-slate-500"></i>
          </a>
          <a href="index2.html" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-900/30 transition ${isLinkActive('index2.html') ? 'text-cyan-400 font-bold bg-cyan-500/10' : 'text-slate-200'}">
            <span class="flex items-center gap-2.5"><i class="bi bi-stars text-cyan-400 text-xs"></i> VIP Nightlife</span>
            <i class="bi bi-chevron-right text-[10px] text-slate-500"></i>
          </a>
        </div>
        <a href="rooms.html" class="flex items-center justify-between p-3 rounded-xl hover:bg-purple-900/30 text-white font-medium">
          <span class="flex items-center gap-3"><i class="bi bi-disc text-cyan-400"></i> Suites</span>
          <i class="bi bi-chevron-right text-xs text-slate-500"></i>
        </a>
        <a href="songs.html" class="flex items-center justify-between p-3 rounded-xl hover:bg-purple-900/30 text-white font-medium">
          <span class="flex items-center gap-3"><i class="bi bi-music-note-beamed text-pink-400"></i> Songbook</span>
          <i class="bi bi-chevron-right text-xs text-slate-500"></i>
        </a>
        <a href="packages.html" class="flex items-center justify-between p-3 rounded-xl hover:bg-purple-900/30 text-white font-medium">
          <span class="flex items-center gap-3"><i class="bi bi-stars text-purple-400"></i> Pricing</span>
          <i class="bi bi-chevron-right text-xs text-slate-500"></i>
        </a>
        <a href="blog.html" class="flex items-center justify-between p-3 rounded-xl hover:bg-purple-900/30 text-white font-medium">
          <span class="flex items-center gap-3"><i class="bi bi-journal-richtext text-cyan-400"></i> Blog</span>
          <i class="bi bi-chevron-right text-xs text-slate-500"></i>
        </a>
        <a href="contact.html" class="flex items-center justify-between p-3 rounded-xl hover:bg-purple-900/30 text-white font-medium">
          <span class="flex items-center gap-3"><i class="bi bi-envelope text-pink-400"></i> Contact Us</span>
          <i class="bi bi-chevron-right text-xs text-slate-500"></i>
        </a>
      </nav>

      <!-- Language / RTL and Actions -->
      <div class="pt-4 border-t border-purple-800/40 space-y-3">
        <div class="grid grid-cols-2 gap-2">
          <button id="mobileRtlBtn" class="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/40 text-xs font-bold text-slate-200 flex items-center justify-center gap-2">
            <i class="bi bi-arrow-left-right text-pink-400"></i>
            <span>${currentDir === 'rtl' ? 'LTR Layout' : 'RTL Layout'}</span>
          </button>
          ${currentUser ? `
            <button id="mobileLogoutBtn" class="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs font-bold text-rose-300 flex items-center justify-center gap-2">
              <i class="bi bi-box-arrow-right"></i> Sign Out
            </button>
          ` : `
            <a href="login.html" id="mobileNavSignInBtn" class="nav-signin-btn p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
              <i class="bi bi-person-fill"></i> Sign In
            </a>
          `}
        </div>

        <a href="dashboard.html#book" class="btn-neon-primary w-full py-3 text-center text-sm">
          <i class="bi bi-calendar-plus"></i> Book a Room Now
        </a>
      </div>

    </div>
  `;

  // Bind Event Listeners
  initNavbarListeners();
});

function initNavbarListeners() {
  // Theme Toggle
  const toggleTheme = () => {
    if (window.StorageManager) {
      const next = window.StorageManager.toggleTheme();
      if (window.Toast) {
        window.Toast.neon(`Switched to ${next.toUpperCase()} Mode!`);
      }
      setTimeout(() => location.reload(), 200);
    }
  };

  const themeBtn = document.getElementById('themeToggleBtn');
  const mobileThemeBtn = document.getElementById('mobileThemeToggleBtn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);

  // RTL Toggle
  const toggleRtl = () => {
    if (window.StorageManager) {
      const next = window.StorageManager.toggleDirection();
      if (window.Toast) {
        window.Toast.info(`Direction set to ${next.toUpperCase()}`);
      }
      setTimeout(() => location.reload(), 200);
    }
  };

  const rtlBtn = document.getElementById('rtlToggleBtn');
  const mobileRtlBtn = document.getElementById('mobileRtlBtn');
  if (rtlBtn) rtlBtn.addEventListener('click', toggleRtl);
  if (mobileRtlBtn) mobileRtlBtn.addEventListener('click', toggleRtl);

  // User Dropdown Trigger
  const trigger = document.getElementById('userDropdownTrigger');
  const menu = document.getElementById('userDropdownMenu');
  if (trigger && menu) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !trigger.contains(e.target)) {
        menu.classList.add('hidden');
      }
    });
  }

  // Home Dropdown Hover and Click Controller (with Graceful Intent Delay)
  const homeContainer = document.getElementById('navHomeDropdownContainer');
  const homeBtn = document.getElementById('navHomeDropdownBtn');
  const homeMenu = document.getElementById('navHomeDropdownMenu');
  const homeChevron = document.getElementById('navHomeChevron');

  if (homeContainer && homeMenu) {
    let hoverTimer = null;

    const openDropdown = () => {
      if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
      }
      homeMenu.classList.remove('hidden');
      if (homeBtn) homeBtn.setAttribute('aria-expanded', 'true');
      if (homeChevron) homeChevron.classList.add('rotate-180');
    };

    const closeDropdown = () => {
      if (hoverTimer) clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        homeMenu.classList.add('hidden');
        if (homeBtn) homeBtn.setAttribute('aria-expanded', 'false');
        if (homeChevron) homeChevron.classList.remove('rotate-180');
      }, 250); // 250ms buffer prevents accidental closure when moving mouse towards items
    };

    // Both mouseenter and mouseleave on container and menu
    homeContainer.addEventListener('mouseenter', openDropdown);
    homeContainer.addEventListener('mouseleave', closeDropdown);
    homeMenu.addEventListener('mouseenter', openDropdown);
    homeMenu.addEventListener('mouseleave', closeDropdown);

    // Click handler for touch devices or direct clicking
    if (homeBtn) {
      homeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (homeMenu.classList.contains('hidden')) {
          openDropdown();
        } else {
          homeMenu.classList.add('hidden');
          homeBtn.setAttribute('aria-expanded', 'false');
          if (homeChevron) homeChevron.classList.remove('rotate-180');
        }
      });
    }

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!homeContainer.contains(e.target)) {
        homeMenu.classList.add('hidden');
        if (homeBtn) homeBtn.setAttribute('aria-expanded', 'false');
        if (homeChevron) homeChevron.classList.remove('rotate-180');
      }
    });
  }

  // Logout Handlers
  window.handleAppLogout = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (window.StorageManager) {
      window.StorageManager.logout();
    } else {
      localStorage.removeItem('vox_current_user');
      localStorage.setItem('vox_system_initialized', 'true');
      localStorage.setItem('vox_user_logged_out', 'true');
    }
    if (window.Toast) {
      window.Toast.info('Logged out successfully.');
    }
    setTimeout(() => {
      const path = window.location.pathname;
      const isHome = path.endsWith('index.html') || path === '/' || path.endsWith('/');
      if (isHome) {
        window.location.reload();
      } else {
        window.location.href = 'index.html';
      }
    }, 300);
  };

  const logoutBtn = document.getElementById('navLogoutBtn');
  const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', window.handleAppLogout);
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', window.handleAppLogout);

  // Mobile Drawer
  const openBtn = document.getElementById('mobileMenuOpenBtn');
  const closeBtn = document.getElementById('mobileMenuCloseBtn');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileDrawerOverlay');

  const openDrawer = () => {
    if (!drawer || !overlay) return;
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => {
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');
      drawer.classList.remove('translate-x-full');
      drawer.classList.add('translate-x-0');
    });
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!drawer || !overlay) return;
    drawer.classList.remove('translate-x-0');
    drawer.classList.add('translate-x-full');
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  };

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
}
