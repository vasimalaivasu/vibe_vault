/**
 * VibeVault - Customer Dashboard Controller
 * Powers dashboard modules: Overview with Countdown, Stepper Booking,
 * Live Reservations Status Timeline, Advance Status Demo Helper, Invoice Generator,
 * Add-ons Manager, Favorites, Notifications, and Profile Base64 Upload.
 */

class VoxDashboard {
  constructor() {
    this.currentSection = 'overview';
    this.countdownInterval = null;
    this.activeReservationFilter = 'all';
    this.searchQuery = '';
    this.init();
  }

  init() {
    // Enforce authentication - unauthenticated users must login
    const user = window.StorageManager ? window.StorageManager.getCurrentUser() : null;
    if (!user) {
      const currentTarget = window.location.pathname.split('/').pop() + window.location.search + window.location.hash;
      window.location.replace('login.html?redirect=' + encodeURIComponent(currentTarget || 'dashboard.html#book'));
      return;
    }

    // Check hash for initial section
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'book', 'reservations', 'addons', 'favorites', 'notifications', 'profile'].includes(hash)) {
      this.currentSection = hash;
    }

    this.render();
    this.bindGlobalEvents();
    this.updateNotificationBadges();

    // Listen for notification changes
    const onNotifChange = () => {
      this.updateNotificationBadges();
      if (this.currentSection === 'notifications' || this.currentSection === 'overview') {
        this.renderSectionContent();
      }
    };
    window.addEventListener('vox_notification_added', onNotifChange);
    window.addEventListener('vox_notifications_updated', onNotifChange);
  }

  setSection(section) {
    this.currentSection = section;
    window.location.hash = section;
    this.updateSidebarActiveState();
    this.updateNotificationBadges();
    this.renderSectionContent();

    // Close mobile sidebar if open
    const sidebar = document.getElementById('dashSidebar');
    const overlay = document.getElementById('dashSidebarOverlay');
    if (sidebar && overlay) {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateSidebarActiveState() {
    const navLinks = document.querySelectorAll('.dash-nav-link');
    navLinks.forEach(link => {
      const sec = link.getAttribute('data-section');
      if (sec === this.currentSection) {
        link.className = 'dash-nav-link flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-600/20 to-purple-800/30 border border-pink-500/40 text-white font-bold shadow-[0_0_15px_rgba(255,0,127,0.2)] transition';
      } else {
        link.className = 'dash-nav-link flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-purple-950/40 transition font-medium';
      }
    });
  }

  render() {
    this.updateSidebarActiveState();
    this.updateNotificationBadges();
    this.renderSectionContent();
  }

  updateNotificationBadges() {
    const notifs = (window.StorageManager && window.StorageManager.getNotifications) ? window.StorageManager.getNotifications() : [];
    const unreadCount = notifs.filter(n => !n.read).length;

    // Topbar Bell Dot (red/pink blinking animation)
    const topbarDot = document.getElementById('dashTopbarNotifDot');
    if (topbarDot) {
      if (unreadCount > 0) {
        topbarDot.classList.remove('hidden');
      } else {
        topbarDot.classList.add('hidden');
      }
    }

    // Sidebar Notification Badge Count
    const sidebarBadge = document.getElementById('dashNotifBadge');
    if (sidebarBadge) {
      if (unreadCount > 0) {
        sidebarBadge.textContent = unreadCount;
        sidebarBadge.classList.remove('hidden');
      } else {
        sidebarBadge.textContent = '0';
        sidebarBadge.classList.add('hidden');
      }
    }
  }

  renderSectionContent() {
    const main = document.getElementById('dashMainContent');
    if (!main) return;

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }

    switch (this.currentSection) {
      case 'overview':
        main.innerHTML = this.renderOverview();
        this.initOverviewCountdown();
        break;
      case 'book':
        main.innerHTML = this.renderBookSection();
        setTimeout(() => {
          window.voxBooking = new VoxBookingStepper('dashBookingContainer');
        }, 50);
        break;
      case 'reservations':
        main.innerHTML = this.renderReservations();
        break;
      case 'addons':
        main.innerHTML = this.renderAddons();
        break;
      case 'favorites':
        main.innerHTML = this.renderFavorites();
        break;
      case 'notifications':
        main.innerHTML = this.renderNotifications();
        break;
      case 'profile':
        main.innerHTML = this.renderProfile();
        break;
    }
  }

  // -------------------------------------------------------------
  // 1. OVERVIEW SECTION
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // 1. OVERVIEW SECTION
  // -------------------------------------------------------------
  renderOverview() {
    const currentUser = window.StorageManager.getCurrentUser();
    const user = currentUser || { 
      name: 'Guest Singer', 
      email: 'guest@partyroom.com', 
      loyaltyPoints: 0, 
      totalSpent: 0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      membershipTier: 'Guest Vocalist'
    };
    const reservations = window.StorageManager.getReservations();
    const upcoming = reservations.find(r => r.status === 'Confirmed' || r.status === 'Pending' || r.status === 'In Session');
    const completedCount = reservations.filter(r => r.status === 'Completed').length;
    const upcomingCount = reservations.filter(r => r.status === 'Confirmed' || r.status === 'Pending' || r.status === 'In Session').length;
    const totalSpent = reservations.reduce((acc, r) => acc + (r.totalAmount || 0), 0);
    const loyaltyPoints = user.loyaltyPoints || 420;
    const loyaltyProgress = Math.min(100, Math.round((loyaltyPoints / 500) * 100));

    // Get room image for upcoming reservation if available
    let roomImage = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80';
    if (upcoming && typeof VOX_ROOMS !== 'undefined') {
      const found = VOX_ROOMS.find(rm => rm.id === upcoming.roomId || rm.name === upcoming.roomName);
      if (found && found.image) roomImage = found.image;
    }

    return `
      <div class="space-y-8 animate-fadeIn">
        
        <!-- 1. VIP Vocalist Spotlight Hero Card -->
        <div class="vip-hero-banner relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#170e30] via-[#100a26] to-[#0c132b] border border-purple-800/50 shadow-2xl">
          <!-- Ambient glowing orbs -->
          <div class="ambient-glow-pink -top-20 -right-20 opacity-35"></div>
          <div class="ambient-glow-cyan -bottom-24 -left-20 opacity-25"></div>

          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <!-- User Info & Welcome -->
            <div class="flex items-start sm:items-center gap-4 sm:gap-6">
              <div class="relative flex-shrink-0">
                <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}" 
                     alt="${user.name}" 
                     class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-pink-500 ring-offset-4 ring-offset-[#0e0921] shadow-[0_0_20px_rgba(255,0,127,0.4)]">
                <span class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black flex items-center justify-center text-xs shadow-md font-black" title="Gold VIP">
                  👑
                </span>
              </div>
              <div class="space-y-1.5">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                    <i class="bi bi-stars"></i> ${user.membershipTier || 'Gold VIP Vocalist'}
                  </span>
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <i class="bi bi-shield-check"></i> VIP Status Active
                  </span>
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    <i class="bi bi-fire"></i> 3-Week Streak
                  </span>
                </div>
                <h2 class="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white">
                  ${currentUser ? `Welcome back to the stage, <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400">${user.name}</span>! 🎤` : `Welcome to <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400">VibeVault</span>! 🎤`}
                </h2>
                <p class="text-xs sm:text-sm text-slate-300 max-w-xl">
                  ${currentUser ? 'Your private lounge is prepped with calibrated acoustics. Review your live stage pass below or reserve your next singing party.' : 'Book private themed karaoke suites, browse the songbook, or sign in to track reservations and earn rewards.'}
                </p>
              </div>
            </div>

            <!-- Quick Action CTA -->
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              ${!currentUser ? `
                <a href="login.html?redirect=dashboard.html" class="btn-neon-primary px-6 py-3.5 text-xs font-bold rounded-2xl shadow-[0_0_25px_rgba(255,0,127,0.4)] flex items-center justify-center gap-2">
                  <i class="bi bi-box-arrow-in-right text-sm"></i>
                  <span>Sign In</span>
                </a>
              ` : `
                <button onclick="window.dashboard.setSection('book')" class="btn-neon-primary px-6 py-3.5 text-xs font-bold rounded-2xl shadow-[0_0_25px_rgba(255,0,127,0.4)] flex items-center justify-center gap-2">
                  <i class="bi bi-calendar-plus text-sm"></i>
                  <span>Book Next Stage</span>
                </button>
              `}
              <button onclick="window.dashboard.setSection('reservations')" class="btn-neon-outline px-5 py-3.5 text-xs font-bold rounded-2xl flex items-center justify-center gap-2">
                <i class="bi bi-ticket-perforated text-sm"></i>
                <span>All Stage Passes</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 2. Upgraded 4-KPI Luxury Metric Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <!-- Card 1: Upcoming Parties -->
          <div class="glass-panel p-5 rounded-2xl border border-purple-800/40 hover:border-pink-500/50 transition-all duration-300 group space-y-3 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <div class="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(255,0,127,0.2)] group-hover:scale-110 transition-transform">
                <i class="bi bi-calendar2-heart"></i>
              </div>
              <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                ${upcoming ? 'Stage Scheduled' : 'No Active'}
              </span>
            </div>
            <div>
              <p class="text-xs text-slate-400 font-medium">Upcoming Parties</p>
              <h4 class="font-display font-black text-2xl sm:text-3xl text-white mt-0.5">${upcomingCount}</h4>
            </div>
            <div class="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px] text-slate-400">
              <span>Next Session:</span>
              <span class="text-pink-300 font-semibold truncate max-w-[130px]">${upcoming ? upcoming.date : 'Book now'}</span>
            </div>
          </div>

          <!-- Card 2: Loyalty Points & Level Gauge -->
          <div class="glass-panel p-5 rounded-2xl border border-purple-800/40 hover:border-amber-500/50 transition-all duration-300 group space-y-3 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <div class="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(251,191,36,0.2)] group-hover:scale-110 transition-transform">
                <i class="bi bi-gem"></i>
              </div>
              <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                ${loyaltyProgress}% to Platinum
              </span>
            </div>
            <div>
              <p class="text-xs text-slate-400 font-medium">VIP Loyalty Points</p>
              <h4 class="font-display font-black text-2xl sm:text-3xl text-amber-400 mt-0.5">${loyaltyPoints} <span class="text-xs font-semibold text-slate-400">pts</span></h4>
            </div>
            <div class="space-y-1 pt-1">
              <div class="w-full bg-purple-950/60 rounded-full h-1.5 overflow-hidden border border-purple-900/50">
                <div class="bg-gradient-to-r from-amber-400 to-pink-500 h-full rounded-full transition-all duration-1000" style="width: ${loyaltyProgress}%"></div>
              </div>
              <div class="flex items-center justify-between text-[10px] text-slate-400">
                <span>Tier: Gold VIP</span>
                <span class="text-amber-300 font-semibold">${Math.max(0, 500 - loyaltyPoints)} pts needed</span>
              </div>
            </div>
          </div>

          <!-- Card 3: Completed Gigs -->
          <div class="glass-panel p-5 rounded-2xl border border-purple-800/40 hover:border-cyan-500/50 transition-all duration-300 group space-y-3 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <div class="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:scale-110 transition-transform">
                <i class="bi bi-mic-fill"></i>
              </div>
              <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Stage Experience
              </span>
            </div>
            <div>
              <p class="text-xs text-slate-400 font-medium">Completed Gigs</p>
              <h4 class="font-display font-black text-2xl sm:text-3xl text-white mt-0.5">${completedCount} <span class="text-xs font-semibold text-slate-400">sessions</span></h4>
            </div>
            <div class="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px] text-slate-400">
              <span>Total Stage Time:</span>
              <span class="text-cyan-300 font-semibold">~14.5 Hours</span>
            </div>
          </div>

          <!-- Card 4: Total Venue Spent -->
          <div class="glass-panel p-5 rounded-2xl border border-purple-800/40 hover:border-emerald-500/50 transition-all duration-300 group space-y-3 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <div class="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
                <i class="bi bi-cash-stack"></i>
              </div>
              <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                VIP 10% Active
              </span>
            </div>
            <div>
              <p class="text-xs text-slate-400 font-medium">Total Venue Spent</p>
              <h4 class="font-display font-black text-2xl sm:text-3xl text-white mt-0.5">$${totalSpent.toFixed(0)}</h4>
            </div>
            <div class="pt-2 border-t border-purple-900/40 flex items-center justify-between text-[11px] text-slate-400">
              <span>VIP Perks Saved:</span>
              <span class="text-emerald-400 font-semibold">Saved $95.00</span>
            </div>
          </div>
        </div>

        <!-- 3. Showcase: VIP Live Stage Pass (Upcoming Session) -->
        ${upcoming ? `
          <div class="vip-stage-pass-card relative overflow-hidden rounded-3xl border-2 border-pink-500/40 bg-gradient-to-br from-[#180e33] via-[#120a28] to-[#0b061c] shadow-[0_0_40px_rgba(255,0,127,0.25)]">
            
            <!-- Top Pass Header Banner -->
            <div class="px-6 py-3.5 bg-gradient-to-r from-pink-600/30 via-purple-900/40 to-cyan-500/20 border-b border-purple-800/40 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></span>
                <span class="text-xs font-black uppercase tracking-widest text-white">UPCOMING VIP STAGE PASS</span>
                <span class="text-[11px] font-mono font-bold text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded-full">REF: ${upcoming.id}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-full font-bold text-xs ${this.getStatusBadgeClass(upcoming.status)}">
                  Status: ${upcoming.status}
                </span>
              </div>
            </div>

            <!-- Main Pass Body: 2 Columns (Room Visual + Countdown/Readiness) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-purple-800/40">
              
              <!-- Left Column: Visual Room Spotlight (7 Cols) -->
              <div class="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 relative">
                <div class="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] border border-purple-700/40 group">
                  <img src="${roomImage}" alt="${upcoming.roomName}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                  <div class="absolute inset-0 bg-gradient-to-t from-[#0e0921] via-[#0e0921]/40 to-transparent"></div>
                  
                  <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div>
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-600 text-white shadow-md inline-block mb-1.5">
                        ${upcoming.roomTheme || 'Themed Lounge'}
                      </span>
                      <h3 class="font-display font-black text-2xl sm:text-3xl text-white leading-tight drop-shadow-md">
                        ${upcoming.roomName}
                      </h3>
                    </div>
                    <!-- Equalizer Widget -->
                    <div class="hidden sm:flex items-end gap-1 h-8 p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-pink-500/40">
                      <span class="w-1.5 h-full bg-pink-500 rounded-full animate-pulse"></span>
                      <span class="w-1.5 h-3/4 bg-cyan-400 rounded-full animate-bounce"></span>
                      <span class="w-1.5 h-5/6 bg-purple-400 rounded-full animate-pulse"></span>
                      <span class="w-1.5 h-1/2 bg-pink-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>

                <!-- Session Details Bar -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div class="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
                    <span class="text-[10px] text-slate-400 block font-medium uppercase tracking-wider"><i class="bi bi-calendar3 text-pink-400 mr-1"></i> Date</span>
                    <span class="font-bold text-white text-xs sm:text-sm mt-0.5 block">${upcoming.date}</span>
                  </div>
                  <div class="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
                    <span class="text-[10px] text-slate-400 block font-medium uppercase tracking-wider"><i class="bi bi-clock-history text-cyan-400 mr-1"></i> Time Slot</span>
                    <span class="font-bold text-white text-xs sm:text-sm mt-0.5 block truncate">${upcoming.timeText}</span>
                  </div>
                  <div class="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 col-span-2 sm:col-span-1">
                    <span class="text-[10px] text-slate-400 block font-medium uppercase tracking-wider"><i class="bi bi-people-fill text-amber-400 mr-1"></i> Party Squad</span>
                    <span class="font-bold text-white text-xs sm:text-sm mt-0.5 block">${upcoming.guests} Vocalists Reserved</span>
                  </div>
                </div>
              </div>

              <!-- Right Column: Countdown, Room Readiness & Actions (5 Cols) -->
              <div class="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[#0f0a24]/60">
                
                <!-- Countdown Section -->
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <i class="bi bi-stopwatch text-sm"></i> Live Stage Countdown
                    </span>
                    <span class="text-[10px] text-slate-400">Local Venue Time</span>
                  </div>

                  <!-- Countdown Digits -->
                  <div class="grid grid-cols-4 gap-2 text-center" id="partyCountdownBoxes">
                    <div class="p-3 rounded-2xl bg-[#090515] border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                      <span class="font-display font-black text-2xl text-cyan-400 block" id="cdDays">02</span>
                      <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-0.5">Days</span>
                    </div>
                    <div class="p-3 rounded-2xl bg-[#090515] border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                      <span class="font-display font-black text-2xl text-cyan-400 block" id="cdHours">14</span>
                      <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-0.5">Hours</span>
                    </div>
                    <div class="p-3 rounded-2xl bg-[#090515] border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                      <span class="font-display font-black text-2xl text-cyan-400 block" id="cdMins">32</span>
                      <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-0.5">Mins</span>
                    </div>
                    <div class="p-3 rounded-2xl bg-[#090515] border border-pink-500/40 shadow-[0_0_15px_rgba(255,0,127,0.2)]">
                      <span class="font-display font-black text-2xl text-pink-400 block" id="cdSecs">48</span>
                      <span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mt-0.5">Secs</span>
                    </div>
                  </div>
                </div>

                <!-- Suite Readiness Checklist -->
                <div class="space-y-2 p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/40">
                  <p class="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <i class="bi bi-shield-check text-emerald-400"></i> Suite Readiness Check
                  </p>
                  <div class="space-y-1.5 text-xs text-slate-300">
                    <div class="flex items-center gap-2">
                      <i class="bi bi-check-circle-fill text-emerald-400 text-sm"></i>
                      <span>Studio Sanitized & Calibrated (Dolby Atmos)</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="bi bi-check-circle-fill text-emerald-400 text-sm"></i>
                      <span>4x Wireless Shure Mics Tested & Paired</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="bi bi-check-circle-fill text-emerald-400 text-sm"></i>
                      <span>Song Library Active (120,000+ Tracks Ready)</span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-2">
                  <div class="grid grid-cols-2 gap-2">
                    <button onclick="window.dashboard.openReservationDrawer('${upcoming.id}')" class="btn-neon-primary py-2.5 text-xs font-bold text-center">
                      <i class="bi bi-qr-code text-sm"></i> Stage Pass QR
                    </button>
                    <button onclick="window.dashboard.setSection('addons')" class="btn-neon-outline py-2.5 text-xs font-bold text-center">
                      <i class="bi bi-basket2 text-sm"></i> Add Drinks/Food
                    </button>
                  </div>
                  <button onclick="window.dashboard.downloadOverviewIcs('${upcoming.id}')" class="w-full py-2 rounded-xl bg-purple-950/60 border border-purple-800/40 hover:bg-purple-900/40 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition">
                    <i class="bi bi-calendar-event text-pink-400"></i> Add to Calendar (.ics)
                  </button>
                </div>

              </div>

            </div>

          </div>
        ` : `
          <!-- No Upcoming Session State -->
          <div class="glass-panel rounded-3xl p-8 border border-purple-800/40 text-center space-y-4">
            <div class="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 mx-auto flex items-center justify-center text-3xl">
              <i class="bi bi-calendar-plus"></i>
            </div>
            <div class="space-y-1">
              <h3 class="font-display font-black text-2xl text-white">No Upcoming Stage Sessions</h3>
              <p class="text-sm text-slate-400 max-w-md mx-auto">You do not have any pending karaoke room sessions. Choose a suite and book your squad's night out!</p>
            </div>
            <button onclick="window.dashboard.setSection('book')" class="btn-neon-primary px-8 py-3 text-sm">
              <i class="bi bi-mic-fill mr-2"></i> Book a Room Now
            </button>
          </div>
        `}

        <!-- 4. Trending Themed Suites & 1-Click Reserve -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-display font-bold text-white text-xl flex items-center gap-2">
                <i class="bi bi-stars text-pink-400"></i> Trending Themed Suites
              </h3>
              <p class="text-xs text-slate-400">Most requested rooms by VIP members this week</p>
            </div>
            <a href="rooms.html" class="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
              <span>Explore All 12 Rooms</span> <i class="bi bi-arrow-right"></i>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Room 1 -->
            <div class="glass-panel rounded-2xl overflow-hidden border border-purple-800/40 hover:border-pink-500/50 transition-all duration-300 group flex flex-col justify-between">
              <div class="relative aspect-[16/10] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80" alt="Cyberpunk Neon Room" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <span class="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-600 text-white shadow">Cyberpunk</span>
                <span class="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-sm text-amber-300"><i class="bi bi-star-fill text-[9px]"></i> 4.9</span>
              </div>
              <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 class="font-display font-bold text-white text-base">Cyberpunk Neon Room</h4>
                  <p class="text-xs text-slate-400 mt-1">Futuristic Tokyo neon grid, 4K projector, zero-latency wireless mics.</p>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-purple-900/40">
                  <span class="font-display font-bold text-pink-400 text-base">$95 <span class="text-[10px] text-slate-400 font-normal">/ hr</span></span>
                  <button onclick="window.dashboard.bookAgain('room-cyberpunk')" class="px-3 py-1.5 rounded-xl bg-purple-900/50 hover:bg-pink-600 text-white text-xs font-bold transition flex items-center gap-1">
                    <i class="bi bi-calendar-plus"></i> Reserve
                  </button>
                </div>
              </div>
            </div>

            <!-- Room 2 -->
            <div class="glass-panel rounded-2xl overflow-hidden border border-purple-800/40 hover:border-cyan-500/50 transition-all duration-300 group flex flex-col justify-between">
              <div class="relative aspect-[16/10] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80" alt="Disco Glam Studio" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <span class="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-600 text-white shadow">Disco Glam</span>
                <span class="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-sm text-amber-300"><i class="bi bi-star-fill text-[9px]"></i> 4.8</span>
              </div>
              <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 class="font-display font-bold text-white text-base">Disco Glam Studio</h4>
                  <p class="text-xs text-slate-400 mt-1">Mirror ball retro aesthetic, neon dance floor, cocktail lounge bar.</p>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-purple-900/40">
                  <span class="font-display font-bold text-cyan-400 text-base">$85 <span class="text-[10px] text-slate-400 font-normal">/ hr</span></span>
                  <button onclick="window.dashboard.bookAgain('room-disco-glam')" class="px-3 py-1.5 rounded-xl bg-purple-900/50 hover:bg-cyan-600 text-white text-xs font-bold transition flex items-center gap-1">
                    <i class="bi bi-calendar-plus"></i> Reserve
                  </button>
                </div>
              </div>
            </div>

            <!-- Room 3 -->
            <div class="glass-panel rounded-2xl overflow-hidden border border-purple-800/40 hover:border-purple-500/50 transition-all duration-300 group flex flex-col justify-between">
              <div class="relative aspect-[16/10] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=600&q=80" alt="Neon Retro 80s" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <span class="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white shadow">Synthwave 80s</span>
                <span class="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-sm text-amber-300"><i class="bi bi-star-fill text-[9px]"></i> 4.9</span>
              </div>
              <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 class="font-display font-bold text-white text-base">Neon Retro 80s</h4>
                  <p class="text-xs text-slate-400 mt-1">Arcade vibes, vaporwave neon lighting, cozy luxury seating for duos.</p>
                </div>
                <div class="flex items-center justify-between pt-2 border-t border-purple-900/40">
                  <span class="font-display font-bold text-purple-400 text-base">$45 <span class="text-[10px] text-slate-400 font-normal">/ hr</span></span>
                  <button onclick="window.dashboard.bookAgain('room-retro-80s')" class="px-3 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-600 text-white text-xs font-bold transition flex items-center gap-1">
                    <i class="bi bi-calendar-plus"></i> Reserve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Visual Recent Stage Sessions Cards (Upgraded from plain table) -->
        <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-800/40 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 class="font-display font-black text-white text-xl flex items-center gap-2">
                <i class="bi bi-clock-history text-cyan-400"></i> Recent Party Bookings
              </h3>
              <p class="text-xs text-slate-400">Track stage timelines, download invoices, or re-book past rooms</p>
            </div>
            <button onclick="window.dashboard.setSection('reservations')" class="btn-neon-outline px-4 py-2 text-xs font-bold self-start sm:self-auto">
              <span>View All Reservations (${reservations.length})</span> <i class="bi bi-arrow-right ml-1"></i>
            </button>
          </div>

          <!-- Cards List -->
          <div class="space-y-3">
            ${reservations.slice(0, 4).map(r => {
              let thumbImg = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=200&q=80';
              if (typeof VOX_ROOMS !== 'undefined') {
                const found = VOX_ROOMS.find(rm => rm.id === r.roomId || rm.name === r.roomName);
                if (found && found.image) thumbImg = found.image;
              }

              return `
                <div class="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/30 hover:border-pink-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div class="flex items-center gap-4">
                    <img src="${thumbImg}" alt="${r.roomName}" class="w-14 h-14 rounded-xl object-cover ring-1 ring-purple-700/50 flex-shrink-0">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-mono text-[11px] font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full">${r.id}</span>
                        <span class="px-2.5 py-0.5 rounded-full font-bold text-[10px] ${this.getStatusBadgeClass(r.status)}">
                          ${r.status}
                        </span>
                      </div>
                      <h4 class="font-display font-bold text-white text-base mt-1">${r.roomName}</h4>
                      <p class="text-xs text-slate-400"><i class="bi bi-calendar3 mr-1 text-slate-500"></i> ${r.date} • ${r.timeText} • ${r.guests} Guests</p>
                    </div>
                  </div>

                  <div class="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-purple-900/40">
                    <div class="text-left md:text-right">
                      <span class="text-[10px] text-slate-400 block font-medium">Total Paid</span>
                      <span class="font-display font-bold text-cyan-400 text-lg">$${(r.totalAmount || 0).toFixed(2)}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <button onclick="window.dashboard.openReservationDrawer('${r.id}')" title="View Details & QR" class="dash-action-btn p-2.5 rounded-xl bg-purple-900/40 hover:bg-pink-600 text-white text-xs font-semibold transition">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button onclick="window.dashboard.printInvoice('${r.id}')" title="Print Invoice" class="dash-action-btn p-2.5 rounded-xl bg-purple-900/40 hover:bg-cyan-600 text-white text-xs font-semibold transition">
                        <i class="bi bi-file-earmark-pdf"></i>
                      </button>
                      <button onclick="window.dashboard.bookAgain('${r.roomId}')" title="Book Again" class="dash-action-btn p-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-600 text-white text-xs font-semibold transition">
                        <i class="bi bi-arrow-clockwise"></i>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 6. VIP Squad Lounge Utilities Hub -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button onclick="window.dashboard.setSection('addons')" class="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/30 hover:border-pink-500/50 hover:bg-purple-900/30 text-left transition group">
            <i class="bi bi-basket2 text-2xl text-pink-400 group-hover:scale-110 transition-transform block mb-2"></i>
            <p class="font-bold text-white text-xs sm:text-sm">Pre-Order Bites</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Wings, nachos & platters</p>
          </button>
          <button onclick="window.dashboard.setSection('favorites')" class="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/30 hover:border-rose-500/50 hover:bg-purple-900/30 text-left transition group">
            <i class="bi bi-heart-fill text-2xl text-rose-400 group-hover:scale-110 transition-transform block mb-2"></i>
            <p class="font-bold text-white text-xs sm:text-sm">Saved Rooms</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Quickly access bookmarks</p>
          </button>
          <button onclick="window.dashboard.openSongCatalogModal()" class="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/30 hover:border-cyan-500/50 hover:bg-purple-900/30 text-left transition group">
            <i class="bi bi-music-note-list text-2xl text-cyan-400 group-hover:scale-110 transition-transform block mb-2"></i>
            <p class="font-bold text-white text-xs sm:text-sm">Song Catalog</p>
            <p class="text-[11px] text-slate-400 mt-0.5">120k tracks & playlists</p>
          </button>
          <button onclick="window.dashboard.openHostConciergeModal()" class="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/30 hover:border-amber-500/50 hover:bg-purple-900/30 text-left transition group">
            <i class="bi bi-chat-heart-fill text-2xl text-amber-400 group-hover:scale-110 transition-transform block mb-2"></i>
            <p class="font-bold text-white text-xs sm:text-sm">Host Concierge</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Live party assistance</p>
          </button>
        </div>

      </div>
    `;
  }

  initOverviewCountdown() {
    const reservations = window.StorageManager.getReservations();
    const upcoming = reservations.find(r => r.status === 'Confirmed' || r.status === 'Pending' || r.status === 'In Session');
    if (!upcoming) return;

    const targetDate = new Date(`${upcoming.date}T${upcoming.timeSlots[0] || '20:00'}:00`);

    const update = () => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        const boxes = document.getElementById('partyCountdownBoxes');
        if (boxes) boxes.innerHTML = `<span class="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-sm">PARTY IN SESSION! 🎤</span>`;
        if (this.countdownInterval) clearInterval(this.countdownInterval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const dEl = document.getElementById('cdDays');
      const hEl = document.getElementById('cdHours');
      const mEl = document.getElementById('cdMins');
      const sEl = document.getElementById('cdSecs');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(mins).padStart(2, '0');
      if (sEl) sEl.textContent = String(secs).padStart(2, '0');
    };

    update();
    this.countdownInterval = setInterval(update, 1000);
  }

  downloadOverviewIcs(resId) {
    const reservations = window.StorageManager.getReservations();
    const res = reservations.find(r => r.id === resId);
    if (!res) {
      if (window.Toast) window.Toast.error('Reservation details not found.');
      return;
    }

    const startSlot = (res.timeSlots && res.timeSlots[0]) ? res.timeSlots[0] : '20:00';
    const lastSlot = (res.timeSlots && res.timeSlots[res.timeSlots.length - 1]) ? res.timeSlots[res.timeSlots.length - 1] : '22:00';
    const endHour = String(parseInt(lastSlot.split(':')[0], 10) + 1).padStart(2, '0') + ':00';

    const cleanDate = res.date.replace(/-/g, '');
    const dtStart = cleanDate + 'T' + startSlot.replace(':', '') + '00';
    const dtEnd = cleanDate + 'T' + endHour.replace(':', '') + '00';

    const icsBody = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VibeVault//VIP Karaoke Room Rental//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${res.id}@vibevault.com`,
      `SUMMARY:🎤 VibeVault VIP Karaoke: ${res.roomName}`,
      `DESCRIPTION:Private Karaoke Suite Booking at VibeVault.\\nBooking Ref: ${res.id}\\nGuests: ${res.guests}\\nTime: ${res.timeText}`,
      `LOCATION:VibeVault Downtown, Studio Suite, 108 Broadway`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsBody], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `VibeVault-${res.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.Toast) window.Toast.success('Stage pass downloaded to your calendar!');
  }

  openSongCatalogModal() {
    let modal = document.getElementById('songCatalogModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'songCatalogModal';
      document.body.appendChild(modal);
    }

    const popularSongs = [
      { title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'Classic Rock', duration: '5:55' },
      { title: 'Blinding Lights', artist: 'The Weeknd', genre: 'Synth-Pop', duration: '3:20' },
      { title: "Don't Stop Believin'", artist: 'Journey', genre: '80s Rock', duration: '4:11' },
      { title: 'Dynamite', artist: 'BTS', genre: 'K-Pop / Dance', duration: '3:19' },
      { title: 'Rolling in the Deep', artist: 'Adele', genre: 'Soul / Pop', duration: '3:48' },
      { title: 'Levitating', artist: 'Dua Lipa', genre: 'Disco Funk', duration: '3:23' },
      { title: 'Mr. Brightside', artist: 'The Killers', genre: 'Alt Rock', duration: '3:42' },
      { title: 'Despacito', artist: 'Luis Fonsi ft. Daddy Yankee', genre: 'Latin Pop', duration: '3:48' }
    ];

    modal.className = 'fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn';
    modal.innerHTML = `
      <div class="glass-panel max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-purple-800/60 shadow-2xl space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-purple-800/40">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-xl">
              <i class="bi bi-music-note-beamed"></i>
            </div>
            <div>
              <h3 class="font-display font-bold text-white text-xl">VibeVault Song Catalog</h3>
              <p class="text-xs text-slate-400">120,000+ Licensed Studio Tracks & Multi-language Vocals</p>
            </div>
          </div>
          <button onclick="document.getElementById('songCatalogModal').remove()" class="w-9 h-9 rounded-xl bg-purple-900/60 hover:bg-pink-600 text-white flex items-center justify-center transition">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="relative">
          <i class="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
          <input type="text" id="songCatalogSearchInput" placeholder="Search track name, artist, or genre..."
                 oninput="window.dashboard.filterCatalogTracks(this.value)"
                 class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400">
        </div>

        <div class="flex flex-wrap gap-2 text-xs">
          <span class="px-3 py-1 rounded-full bg-pink-600 text-white font-bold cursor-pointer">All Tracks</span>
          <span class="px-3 py-1 rounded-full bg-purple-900/40 hover:bg-purple-800/60 text-slate-300 cursor-pointer">Pop Hits</span>
          <span class="px-3 py-1 rounded-full bg-purple-900/40 hover:bg-purple-800/60 text-slate-300 cursor-pointer">80s Classic</span>
          <span class="px-3 py-1 rounded-full bg-purple-900/40 hover:bg-purple-800/60 text-slate-300 cursor-pointer">K-Pop</span>
          <span class="px-3 py-1 rounded-full bg-purple-900/40 hover:bg-purple-800/60 text-slate-300 cursor-pointer">Rock Anthems</span>
        </div>

        <div class="space-y-2.5 divide-y divide-purple-900/30" id="songCatalogList">
          ${popularSongs.map((s, idx) => `
            <div class="pt-2.5 flex items-center justify-between gap-3 text-xs group hover:bg-purple-950/30 p-2 rounded-xl transition">
              <div class="flex items-center gap-3">
                <span class="font-mono text-slate-500 w-5 text-right font-bold">${idx + 1}</span>
                <div class="w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-700/40 text-pink-400 flex items-center justify-center text-xs group-hover:scale-105 transition-transform">
                  <i class="bi bi-disc"></i>
                </div>
                <div>
                  <h5 class="font-bold text-white group-hover:text-cyan-400 transition">${s.title}</h5>
                  <p class="text-[11px] text-slate-400">${s.artist} • <span class="text-purple-300">${s.genre}</span></p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-slate-500 text-[11px] font-mono">${s.duration}</span>
                <button onclick="window.Toast && window.Toast.neon('Queued &quot;${s.title}&quot; to your suite iPad!');" 
                        class="p-2 rounded-lg bg-purple-900/50 hover:bg-pink-600 text-white transition flex items-center gap-1 font-bold text-[11px]">
                  <i class="bi bi-plus-lg"></i> Queue Song
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="pt-2 border-t border-purple-800/40 flex items-center justify-between text-xs text-slate-400">
          <span>Synced with Touchscreen iPad System</span>
          <button onclick="document.getElementById('songCatalogModal').remove()" class="text-cyan-400 hover:underline font-bold">
            Close Catalog
          </button>
        </div>
      </div>
    `;
  }

  filterCatalogTracks(query) {
    const items = document.querySelectorAll('#songCatalogList > div');
    const q = query.toLowerCase();
    items.forEach(el => {
      const text = el.innerText.toLowerCase();
      el.style.display = text.includes(q) ? 'flex' : 'none';
    });
  }

  openHostConciergeModal() {
    let modal = document.getElementById('hostConciergeModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'hostConciergeModal';
      document.body.appendChild(modal);
    }

    modal.className = 'fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn';
    modal.innerHTML = `
      <div class="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-purple-800/60 shadow-2xl space-y-6">
        <div class="flex items-center justify-between pb-4 border-b border-purple-800/40">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl">
              <i class="bi bi-bell"></i>
            </div>
            <div>
              <h3 class="font-display font-bold text-white text-xl">VIP Host Concierge</h3>
              <p class="text-xs text-slate-400">Direct In-Room & Stage Support Desk</p>
            </div>
          </div>
          <button onclick="document.getElementById('hostConciergeModal').remove()" class="modal-close-btn w-9 h-9 rounded-xl bg-purple-900/60 hover:bg-pink-600 text-white flex items-center justify-center transition">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="space-y-3">
          <p class="text-xs text-slate-300 font-medium">Select a concierge request for your reserved party:</p>
          
          <div class="grid grid-cols-1 gap-2.5">
            <button onclick="window.dashboard.submitConciergeRequest('Bottle Service & Cocktail Menu');" 
                    class="p-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 text-left transition flex items-center gap-3 group">
              <i class="bi bi-cup-straw text-pink-400 text-xl group-hover:scale-110 transition-transform"></i>
              <div>
                <span class="text-white font-bold text-xs block">Bottle Service & Mixology</span>
                <span class="text-[11px] text-slate-400">Request cocktail server and ice bucket to suite</span>
              </div>
            </button>

            <button onclick="window.dashboard.submitConciergeRequest('Sound & Mic Calibration');" 
                    class="p-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 text-left transition flex items-center gap-3 group">
              <i class="bi bi-sliders text-cyan-400 text-xl group-hover:scale-110 transition-transform"></i>
              <div>
                <span class="text-white font-bold text-xs block">Sound & Microphone Calibration</span>
                <span class="text-[11px] text-slate-400">Sound technician visits suite for vocal tuning</span>
              </div>
            </button>

            <button onclick="window.dashboard.submitConciergeRequest('Party Props & Lighting FX');" 
                    class="p-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 text-left transition flex items-center gap-3 group">
              <i class="bi bi-magic text-purple-400 text-xl group-hover:scale-110 transition-transform"></i>
              <div>
                <span class="text-white font-bold text-xs block">Party Props & Strobe FX</span>
                <span class="text-[11px] text-slate-400">Glow sticks, tambourines & custom laser modes</span>
              </div>
            </button>

            <button onclick="window.dashboard.submitConciergeRequest('Late Night Session Extension');" 
                    class="p-3.5 rounded-2xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/50 text-left transition flex items-center gap-3 group">
              <i class="bi bi-clock-history text-amber-400 text-xl group-hover:scale-110 transition-transform"></i>
              <div>
                <span class="text-white font-bold text-xs block">Request Session Extension (+1 hr)</span>
                <span class="text-[11px] text-slate-400">Subject to suite schedule availability</span>
              </div>
            </button>
          </div>
        </div>

        <div class="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex items-center gap-2 text-xs text-emerald-300">
          <i class="bi bi-shield-check text-emerald-400 text-base"></i>
          <span>Average Host Response Time: under 3 minutes</span>
        </div>
      </div>
    `;
  }

  submitConciergeRequest(serviceName) {
    const modal = document.getElementById('hostConciergeModal');
    if (modal) modal.remove();
    if (window.Toast) {
      window.Toast.neon(`Concierge Dispatch: "${serviceName}" requested! A lounge host is on the way.`);
    }
  }

  // -------------------------------------------------------------
  // 2. BOOK A ROOM SECTION
  // -------------------------------------------------------------
  renderBookSection() {
    return `
      <div class="space-y-6">
        <div>
          <h2 class="font-display font-black text-3xl text-white">Book a Room & Pick Time Slot</h2>
          <p class="text-sm text-slate-400">Complete the 5-step wizard to reserve your private karaoke suite with instant confirmation.</p>
        </div>

        <div id="dashBookingContainer"></div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // 3. MY RESERVATIONS & STATUS TRACKING
  // -------------------------------------------------------------
  renderReservations() {
    const all = window.StorageManager.getReservations();
    
    // Filter by tab
    let list = all;
    if (this.activeReservationFilter !== 'all') {
      list = all.filter(r => {
        if (this.activeReservationFilter === 'upcoming') return r.status === 'Confirmed' || r.status === 'Pending';
        if (this.activeReservationFilter === 'in-progress') return r.status === 'Checked In' || r.status === 'In Session';
        if (this.activeReservationFilter === 'completed') return r.status === 'Completed';
        if (this.activeReservationFilter === 'cancelled') return r.status === 'Cancelled';
        return true;
      });
    }

    // Filter by search query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(r => r.id.toLowerCase().includes(q) || r.roomName.toLowerCase().includes(q) || r.date.includes(q));
    }

    return `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="font-display font-black text-3xl text-white">My Reservations</h2>
            <p class="text-sm text-slate-400">Track real-time room sessions, reschedule dates, cancel slots or print invoices.</p>
          </div>
          <button onclick="window.dashboard.setSection('book')" class="btn-neon-primary px-5 py-2.5 text-xs">
            <i class="bi bi-plus-lg"></i> New Booking
          </button>
        </div>

        <!-- Filter Tabs & Search Bar -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-3 rounded-2xl border border-purple-800/40">
          <div class="flex flex-wrap gap-1.5 w-full md:w-auto">
            <button onclick="window.dashboard.filterReservations('all')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${this.activeReservationFilter === 'all' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
              All (${all.length})
            </button>
            <button onclick="window.dashboard.filterReservations('upcoming')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${this.activeReservationFilter === 'upcoming' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
              Upcoming
            </button>
            <button onclick="window.dashboard.filterReservations('in-progress')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${this.activeReservationFilter === 'in-progress' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
              In Progress
            </button>
            <button onclick="window.dashboard.filterReservations('completed')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${this.activeReservationFilter === 'completed' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
              Completed
            </button>
            <button onclick="window.dashboard.filterReservations('cancelled')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${this.activeReservationFilter === 'cancelled' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
              Cancelled
            </button>
          </div>

          <div class="relative w-full md:w-64">
            <i class="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
            <input type="text" placeholder="Search by ID or Room..." value="${this.searchQuery}"
                   oninput="window.dashboard.searchReservations(this.value)"
                   class="w-full pl-9 pr-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500">
          </div>
        </div>

        <!-- Reservations Cards List -->
        <div class="space-y-4">
          ${list.length > 0 ? list.map(r => `
            <div class="glass-panel p-6 rounded-3xl border border-purple-800/40 hover:border-cyan-500/50 transition-all space-y-4">
              
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-800/30">
                <div class="flex items-center gap-3">
                  <span class="font-mono font-black text-sm text-white px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-700/50">${r.id}</span>
                  <h4 class="font-display font-bold text-lg text-white">${r.roomName}</h4>
                  <span class="text-xs text-purple-300 font-medium">(${r.roomTheme || 'Themed Room'})</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 rounded-full text-xs font-bold ${this.getStatusBadgeClass(r.status)}">
                    ${r.status}
                  </span>
                </div>
              </div>

              <!-- Animated Status Timeline -->
              <div class="py-2">
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Live Session Progression:</p>
                ${this.renderStatusTimeline(r.status)}
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300 bg-purple-950/20 p-3.5 rounded-2xl border border-purple-900/30">
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-bold">Party Date</span>
                  <span class="font-bold text-white">${r.date}</span>
                </div>
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-bold">Slot Time</span>
                  <span class="font-bold text-pink-400">${r.timeText}</span>
                </div>
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-bold">Guests & Extras</span>
                  <span class="font-bold text-white">${r.guests} Guests • ${r.addOns ? r.addOns.length : 0} Extras</span>
                </div>
                <div>
                  <span class="text-slate-500 block text-[10px] uppercase font-bold">Total Amount</span>
                  <span class="font-display font-black text-sm text-cyan-400">$${(r.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>

              <!-- Action Buttons Bar -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
                
                <!-- Demo Helper control to advance status -->
                <div class="demo-advance-box flex items-center gap-2 bg-[#0c081e] px-3 py-1.5 rounded-xl border border-cyan-500/30 text-xs">
                  <span class="text-[10px] font-bold text-cyan-400 uppercase"><i class="bi bi-hammer"></i> Demo Advance:</span>
                  <button type="button" onclick="window.dashboard.advanceStatus('${r.id}')"
                          class="px-2 py-0.5 rounded bg-cyan-500 text-black font-extrabold text-[10px] hover:bg-cyan-400 transition"
                          title="Click to progress this booking to the next stage">
                    Next Stage →
                  </button>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                  <button onclick="window.dashboard.openReservationDrawer('${r.id}')" class="btn-neon-outline px-3.5 py-1.5 text-xs">
                    <i class="bi bi-file-text"></i> Details
                  </button>
                  <button onclick="window.dashboard.printInvoice('${r.id}')" class="dash-action-btn px-3.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-800 text-slate-200 text-xs font-semibold border border-purple-700/50 transition flex items-center gap-1.5">
                    <i class="bi bi-printer"></i> Invoice
                  </button>
                  ${r.status === 'Confirmed' || r.status === 'Pending' ? `
                    <button onclick="window.dashboard.rescheduleBooking('${r.id}')" class="dash-action-btn px-3.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-800 text-cyan-300 text-xs font-semibold border border-cyan-700/50 transition flex items-center gap-1.5">
                      <i class="bi bi-arrow-repeat"></i> Reschedule
                    </button>
                    <button onclick="window.dashboard.cancelBookingPrompt('${r.id}')" class="dash-action-btn px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-semibold border border-rose-800/50 transition flex items-center gap-1.5">
                      <i class="bi bi-x-circle"></i> Cancel Slot
                    </button>
                  ` : ''}
                  <button onclick="window.dashboard.bookAgain('${r.roomId}')" class="btn-neon-primary px-3.5 py-1.5 text-xs">
                    <i class="bi bi-arrow-clockwise"></i> Book Again
                  </button>
                </div>

              </div>

            </div>
          `).join('') : `
            <div class="glass-panel p-12 text-center rounded-3xl border border-purple-800/40 space-y-4">
              <i class="bi bi-calendar-x text-4xl empty-state-icon"></i>
              <h4 class="font-display font-bold text-white text-lg">No reservations found</h4>
              <p class="text-xs text-slate-400">No bookings match your current filter. You can book a room in minutes!</p>
              <button onclick="window.dashboard.setSection('book')" class="btn-neon-primary px-6 py-2.5 text-xs">
                Explore Themed Rooms & Book
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  renderStatusTimeline(status) {
    if (status === 'Cancelled') {
      return `
        <div class="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
          <i class="bi bi-x-octagon-fill text-rose-400 text-base"></i>
          <span>This reservation was cancelled. The room slot has been released back into availability.</span>
        </div>
      `;
    }

    const stages = ['Pending', 'Confirmed', 'Checked In', 'In Session', 'Completed'];
    const currentIdx = stages.indexOf(status);

    return `
      <div class="flex items-center justify-between relative max-w-2xl px-2">
        <div class="status-timeline-track absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-purple-950 -z-0">
          <div class="h-full bg-gradient-to-r from-emerald-500 to-pink-500 transition-all duration-500"
               style="width: ${Math.max(0, currentIdx / (stages.length - 1)) * 100}%"></div>
        </div>

        ${stages.map((st, i) => {
          let bulletCls = 'status-step-bullet upcoming';
          if (i < currentIdx) bulletCls = 'status-step-bullet completed';
          if (i === currentIdx) bulletCls = 'status-step-bullet current';

          return `
            <div class="flex flex-col items-center gap-1.5 relative z-10">
              <div class="${bulletCls}">
                ${i < currentIdx ? '<i class="bi bi-check-lg"></i>' : i + 1}
              </div>
              <span class="text-[10px] font-bold ${i === currentIdx ? 'status-label-current text-pink-400 font-black' : i < currentIdx ? 'status-label-completed text-emerald-400' : 'status-label-upcoming text-slate-600'}">
                ${st}
              </span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  getStatusBadgeClass(status) {
    switch (status) {
      case 'Confirmed': return 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
      case 'Checked In': return 'bg-purple-500/20 text-purple-300 border border-purple-500/40';
      case 'In Session': return 'bg-pink-500/20 text-pink-300 border border-pink-500/40 animate-pulse';
      case 'Completed': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      case 'Cancelled': return 'bg-rose-500/20 text-rose-300 border border-rose-500/40';
      default: return 'bg-slate-500/20 text-slate-300 border border-slate-500/40';
    }
  }

  filterReservations(filter) {
    this.activeReservationFilter = filter;
    this.renderSectionContent();
  }

  searchReservations(q) {
    this.searchQuery = q;
    this.renderSectionContent();
  }

  advanceStatus(id) {
    const r = window.StorageManager.getReservationById(id);
    if (!r) return;

    const flow = ['Pending', 'Confirmed', 'Checked In', 'In Session', 'Completed'];
    const curIdx = flow.indexOf(r.status);
    let nextStatus = 'Completed';

    if (curIdx !== -1 && curIdx < flow.length - 1) {
      nextStatus = flow[curIdx + 1];
    } else {
      nextStatus = 'Pending'; // loop around for demo testing
    }

    window.StorageManager.updateReservationStatus(id, nextStatus);
    if (window.Toast) {
      window.Toast.neon(`Demo Status: Advanced ${id} to "${nextStatus}"!`);
    }
    this.renderSectionContent();
  }

  cancelBookingPrompt(id) {
    if (confirm(`Are you sure you want to cancel booking ${id}? Your slot will be freed.`)) {
      window.StorageManager.cancelReservation(id);
      if (window.Toast) window.Toast.warning(`Reservation ${id} has been cancelled.`);
      this.renderSectionContent();
    }
  }

  rescheduleBooking(id) {
    const booking = window.StorageManager.getReservationById(id);
    if (!booking) return;

    this.setSection('book');
    setTimeout(() => {
      if (window.voxBooking) {
        window.voxBooking.state.selectedRoom = window.VOX_ROOMS.find(r => r.id === booking.roomId) || window.VOX_ROOMS[0];
        window.voxBooking.state.selectedDate = booking.date;
        window.voxBooking.goToStep(2);
        if (window.Toast) window.Toast.info(`Prefilled ${booking.roomName} for rescheduling. Choose new date/slot.`);
      }
    }, 100);
  }

  bookAgain(roomId) {
    this.setSection('book');
    setTimeout(() => {
      if (window.voxBooking && roomId) {
        window.voxBooking.selectRoom(roomId);
        window.voxBooking.goToStep(2);
      }
    }, 100);
  }

  // -------------------------------------------------------------
  // RESERVATION DETAILS DRAWER & PRINTABLE INVOICE
  // -------------------------------------------------------------
  openReservationDrawer(id) {
    const r = window.StorageManager.getReservationById(id);
    if (!r) return;

    let drawer = document.getElementById('reservationDrawerModal');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'reservationDrawerModal';
      document.body.appendChild(drawer);
    }

    drawer.className = 'fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md';
    drawer.innerHTML = `
      <div class="glass-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-purple-800/60 shadow-2xl space-y-6">
        
        <div class="flex items-center justify-between pb-4 border-b border-purple-800/40">
          <div>
            <span class="text-xs font-mono font-bold text-pink-400">Ref: ${r.id}</span>
            <h3 class="font-display font-black text-2xl text-white mt-0.5">${r.roomName}</h3>
          </div>
          <button onclick="document.getElementById('reservationDrawerModal').remove()" class="modal-close-btn w-9 h-9 rounded-xl bg-purple-900/60 hover:bg-pink-600 text-white flex items-center justify-center">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Live Status Tracking Bar -->
        <div class="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-3">
          <div class="flex justify-between items-center text-xs">
            <span class="font-bold text-white uppercase tracking-wider">Status Progression:</span>
            <span class="px-3 py-0.5 rounded-full font-bold ${this.getStatusBadgeClass(r.status)}">${r.status}</span>
          </div>
          ${this.renderStatusTimeline(r.status)}
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-2 gap-3 text-xs text-slate-300">
          <div class="p-3 rounded-xl bg-[#0b081c] border border-purple-900/40">
            <span class="text-slate-500 block text-[10px] uppercase font-bold">Party Date</span>
            <span class="font-bold text-white text-sm">${r.date}</span>
          </div>
          <div class="p-3 rounded-xl bg-[#0b081c] border border-purple-900/40">
            <span class="text-slate-500 block text-[10px] uppercase font-bold">Slot Time</span>
            <span class="font-bold text-pink-400 text-sm">${r.timeText}</span>
          </div>
          <div class="p-3 rounded-xl bg-[#0b081c] border border-purple-900/40">
            <span class="text-slate-500 block text-[10px] uppercase font-bold">Guests & Occasion</span>
            <span class="font-bold text-white">${r.guests} Guests (${r.occasion || 'Celebration'})</span>
          </div>
          <div class="p-3 rounded-xl bg-[#0b081c] border border-purple-900/40">
            <span class="text-slate-500 block text-[10px] uppercase font-bold">Hourly Rate</span>
            <span class="font-bold text-white">$${r.hourlyRate || 65}/hr</span>
          </div>
        </div>

        <!-- Addons -->
        <div class="space-y-2 text-xs">
          <h5 class="font-bold text-white uppercase tracking-wider">Included Extras & Add-ons:</h5>
          ${r.addOns && r.addOns.length > 0 ? r.addOns.map(a => `
            <div class="flex justify-between items-center p-2 rounded-lg bg-purple-950/30">
              <span class="text-slate-300">${a.qty}x ${a.name}</span>
              <span class="font-bold text-white">$${(a.price * a.qty).toFixed(2)}</span>
            </div>
          `).join('') : `<p class="text-slate-500">No add-ons pre-ordered.</p>`}
        </div>

        <!-- Payment Breakdown -->
        <div class="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-2 text-xs text-slate-300">
          <div class="flex justify-between"><span>Room Subtotal:</span> <span class="font-bold text-white">$${(r.roomSubtotal || 0).toFixed(2)}</span></div>
          <div class="flex justify-between"><span>Addons Subtotal:</span> <span class="font-bold text-white">$${(r.addonsSubtotal || 0).toFixed(2)}</span></div>
          <div class="flex justify-between"><span>Taxes & Service (8%):</span> <span class="font-bold text-white">$${(r.taxes || 0).toFixed(2)}</span></div>
          <div class="flex justify-between pt-2 border-t border-purple-800/40 font-bold text-sm text-white">
            <span>Total:</span> <span class="text-cyan-400">$${(r.totalAmount || 0).toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-pink-400 font-bold">
            <span>Deposit Paid:</span> <span>$${(r.depositPaid || 0).toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-slate-400">
            <span>Balance due at check-in:</span> <span>$${(r.balanceDue || 0).toFixed(2)}</span>
          </div>
        </div>

        <!-- Drawer Footer Buttons -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button onclick="window.dashboard.printInvoice('${r.id}')" class="btn-neon-outline px-4 py-2 text-xs">
            <i class="bi bi-printer"></i> Print Invoice
          </button>
          <button onclick="document.getElementById('reservationDrawerModal').remove()" class="btn-neon-primary px-5 py-2 text-xs">
            Close
          </button>
        </div>

      </div>
    `;
  }

  printInvoice(id) {
    const r = window.StorageManager.getReservationById(id);
    if (!r) return;

    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${r.id} - VibeVault</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: auto; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #FF007F; padding-bottom: 20px; }
          .logo { font-size: 26px; font-weight: 900; color: #111; }
          .logo span { color: #FF007F; }
          .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
          .table th, .table td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
          .table th { background: #f8f8f8; font-size: 13px; text-transform: uppercase; }
          .total-box { margin-top: 30px; text-align: right; }
          .total-box p { margin: 5px 0; }
          .grand { font-size: 20px; font-weight: bold; color: #FF007F; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">VIBE<span>VAULT</span></div>
            <p>428 Neon Strip Ave, Suite 100<br>VIP Bookings: +1 (800) 869-5686<br>support@vibevault.com</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; color: #333;">INVOICE</h2>
            <p><b>Invoice No:</b> ${r.id}<br><b>Date:</b> ${new Date().toLocaleDateString()}<br><b>Status:</b> ${r.status}</p>
          </div>
        </div>

        <div style="margin-top: 25px;">
          <h3>Reservation Summary</h3>
          <p><b>Room:</b> ${r.roomName} (${r.roomTheme})<br>
          <b>Session Date:</b> ${r.date}<br>
          <b>Time Slot:</b> ${r.timeText}<br>
          <b>Guests:</b> ${r.guests} guests (${r.occasion || 'Private Party'})</p>
        </div>

        <table class="table">
          <thead>
            <tr><th>Item Description</th><th>Hours / Qty</th><th>Rate</th><th style="text-align: right;">Amount</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Room Hire - ${r.roomName}</td>
              <td>${r.hoursCount || 2} Hours</td>
              <td>$${r.hourlyRate || 65}/hr</td>
              <td style="text-align: right;">$${(r.roomSubtotal || 0).toFixed(2)}</td>
            </tr>
            ${r.addOns && r.addOns.map(a => `
              <tr>
                <td>${a.name}</td>
                <td>${a.qty}</td>
                <td>$${a.price.toFixed(2)}</td>
                <td style="text-align: right;">$${(a.price * a.qty).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-box">
          <p>Subtotal: $${((r.roomSubtotal || 0) + (r.addonsSubtotal || 0)).toFixed(2)}</p>
          <p>Taxes & Venue Tech (8%): $${(r.taxes || 0).toFixed(2)}</p>
          <p class="grand">Total: $${(r.totalAmount || 0).toFixed(2)}</p>
          <p style="color: green; font-weight: bold;">Deposit Paid: $${(r.depositPaid || 0).toFixed(2)}</p>
          <p style="color: #444;">Balance Due Upon Arrival: $${(r.balanceDue || 0).toFixed(2)}</p>
        </div>

        <div class="footer">
          <p>Thank you for choosing VibeVault! We can't wait to hear your voices on stage.</p>
          <p>Questions? Contact support@vibevault.com</p>
          <br>
          <button onclick="window.print()" style="padding: 10px 20px; background: #FF007F; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Print Invoice</button>
        </div>
      </body>
      </html>
    `);
    printWin.document.close();
  }

  // -------------------------------------------------------------
  // 4. ADD-ONS & PACKAGES SECTION
  // -------------------------------------------------------------
  renderAddons() {
    const addons = window.VOX_ADDONS || [];
    const upcomingList = window.StorageManager.getReservations().filter(r => r.status === 'Confirmed' || r.status === 'Pending');

    return `
      <div class="space-y-6">
        <div>
          <h2 class="font-display font-black text-3xl text-white">Party Add-ons & Catering</h2>
          <p class="text-sm text-slate-400">Order snacks, drinks, balloons or DJ hosts for an upcoming party in advance.</p>
        </div>

        ${upcomingList.length > 0 ? `
          <div class="glass-panel p-4 rounded-2xl border border-cyan-500/40 flex items-center justify-between gap-4 text-xs">
            <div class="flex items-center gap-2">
              <i class="bi bi-info-circle-fill text-cyan-400 text-base"></i>
              <span>Select an upcoming reservation to attach extras:</span>
            </div>
            <select id="addonTargetReservation" class="px-3 py-1.5 rounded-xl bg-purple-950 border border-purple-700 text-white font-bold text-xs">
              ${upcomingList.map(r => `
                <option value="${r.id}">${r.id} - ${r.roomName} (${r.date})</option>
              `).join('')}
            </select>
          </div>
        ` : `
          <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
            No upcoming reservations to attach add-ons to. You can browse the items below or book a room first!
          </div>
        `}

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${addons.map(a => `
            <div class="glass-panel p-4 rounded-2xl border border-purple-800/40 hover:border-pink-500/50 transition-all flex flex-col justify-between">
              <div>
                <div class="h-36 rounded-xl overflow-hidden mb-3 relative">
                  <img src="${a.image}" alt="${a.name}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='assets/images/celebration-cake.jpg'">
                  <span class="absolute top-2 right-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#0b0914]/80 text-cyan-300 border border-cyan-400/30">
                    ${a.category}
                  </span>
                </div>
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-display font-bold text-white text-base">${a.name}</h4>
                  <span class="font-black text-pink-400 text-base">$${a.price}</span>
                </div>
                <p class="text-xs text-slate-400 mb-3">${a.description}</p>
              </div>

              <div class="pt-3 border-t border-purple-800/30 flex items-center justify-between">
                <span class="text-xs text-slate-500">${a.unit}</span>
                <button onclick="window.dashboard.addAddonToUpcoming('${a.id}')"
                        class="btn-neon-primary px-3.5 py-1.5 text-xs">
                  <i class="bi bi-plus-lg"></i> Add to Party
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  addAddonToUpcoming(addonId) {
    const targetSelect = document.getElementById('addonTargetReservation');
    const targetId = targetSelect ? targetSelect.value : null;

    if (!targetId) {
      if (window.Toast) window.Toast.warning('Please book a room first to attach extras.');
      return;
    }

    const addon = window.VOX_ADDONS.find(a => a.id === addonId);
    if (!addon) return;

    window.StorageManager.addAddonToReservation(targetId, addon, 1);
    if (window.Toast) {
      window.Toast.success(`Added 1x ${addon.name} to booking ${targetId}!`, 'Added to Party! 🥂');
    }
  }

  // -------------------------------------------------------------
  // 5. FAVORITES SECTION
  // -------------------------------------------------------------
  renderFavorites() {
    const favIds = window.StorageManager.getFavorites();
    const rooms = window.VOX_ROOMS || [];
    const favRooms = rooms.filter(r => favIds.includes(r.id));

    return `
      <div class="space-y-6">
        <div>
          <h2 class="font-display font-black text-3xl text-white">Saved Themed Rooms</h2>
          <p class="text-sm text-slate-400">Your favorite karaoke suites, synced across your browser profile.</p>
        </div>

        ${favRooms.length > 0 ? `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${favRooms.map(room => `
              <div class="room-card glass-panel p-4 rounded-2xl border border-purple-800/40 relative">
                
                <button onclick="window.dashboard.removeFavorite('${room.id}')"
                        class="favorite-room-btn is-favorite absolute top-6 right-6 z-20 w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center p-0 text-sm shadow-lg hover:scale-110 transition">
                  <svg class="w-4 h-4 heart-svg pointer-events-none" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  </svg>
                </button>

                <div class="relative h-44 rounded-xl overflow-hidden mb-3">
                  <img src="${room.image}" alt="${room.name}" class="card-img w-full h-full object-cover">
                  <span class="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl text-xs font-black bg-pink-600 text-white">
                    $${room.pricePerHour}/hr
                  </span>
                </div>

                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <h4 class="font-display font-bold text-white text-base">${room.name}</h4>
                    <span class="text-xs text-amber-400 font-bold"><i class="bi bi-star-fill"></i> ${room.rating}</span>
                  </div>
                  <p class="text-xs text-slate-400 line-clamp-2">${room.tagline}</p>
                </div>

                <div class="mt-4 pt-3 border-t border-purple-800/30 flex items-center justify-between">
                  <span class="text-xs text-cyan-300 font-semibold">${room.capacityText}</span>
                  <button onclick="window.dashboard.bookAgain('${room.id}')" class="btn-neon-primary px-4 py-1.5 text-xs">
                    Book Now
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="glass-panel p-12 text-center rounded-3xl border border-purple-800/40 space-y-4">
            <i class="bi bi-heart text-4xl empty-state-icon"></i>
            <h4 class="font-display font-bold text-white text-lg">No saved rooms yet</h4>
            <p class="text-xs text-slate-400">Click the heart icon on any themed room to save it here for easy booking.</p>
            <a href="rooms.html" class="btn-neon-primary inline-flex px-6 py-2.5 text-xs">
              Explore All Themed Rooms
            </a>
          </div>
        `}
      </div>
    `;
  }

  removeFavorite(roomId) {
    window.StorageManager.toggleFavorite(roomId);
    if (window.Toast) window.Toast.info('Removed room from saved favorites.');
    this.renderSectionContent();
  }

  // -------------------------------------------------------------
  // 6. NOTIFICATIONS SECTION
  // -------------------------------------------------------------
  renderNotifications() {
    const notifs = window.StorageManager.getNotifications();

    return `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-display font-black text-3xl text-white">Notifications & Alerts</h2>
            <p class="text-sm text-slate-400">Booking reminders, VIP loyalty perks, and secret squad codes.</p>
          </div>
          ${notifs.length > 0 ? `
            <button onclick="window.dashboard.clearAllNotifications()" class="text-xs text-rose-400 hover:underline">
              Clear All Notifications
            </button>
          ` : ''}
        </div>

        <div class="space-y-3">
          ${notifs.length > 0 ? notifs.map(n => `
            <div class="glass-panel dash-notif-card ${!n.read ? 'unread border-pink-500/50 bg-purple-950/30 shadow-[0_0_15px_rgba(255,0,127,0.15)]' : 'border-purple-800/30'} p-4 rounded-2xl border flex items-start gap-4 transition-all">
              <div class="dash-notif-icon-wrap w-10 h-10 rounded-xl bg-purple-900/60 text-cyan-400 flex items-center justify-center text-lg flex-shrink-0 mt-0.5 transition-colors">
                <i class="bi ${n.type === 'reward' ? 'bi-gift-fill text-amber-400' : n.type === 'promo' ? 'bi-ticket-perforated-fill text-pink-400' : 'bi-bell-fill text-cyan-400'}"></i>
              </div>
              <div class="flex-1 space-y-1">
                <div class="flex items-center justify-between">
                  <h4 class="font-display font-bold text-white text-sm">${n.title}</h4>
                  <span class="text-[11px] text-slate-500">${n.time}</span>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed">${n.message}</p>
              </div>
              ${!n.read ? `
                <button onclick="window.dashboard.markRead('${n.id}')" title="Mark as read" class="dash-notif-mark-btn text-xs text-slate-400 hover:text-white p-1 transition-colors">
                  <i class="bi bi-check2"></i>
                </button>
              ` : ''}
            </div>
          `).join('') : `
            <div class="glass-panel p-12 text-center rounded-3xl border border-purple-800/40 text-slate-400">
              <i class="bi bi-bell-slash text-3xl empty-state-icon block mb-2"></i>
              No notifications at this time.
            </div>
          `}
        </div>
      </div>
    `;
  }

  markRead(id) {
    window.StorageManager.markNotificationRead(id);
    this.updateNotificationBadges();
    this.renderSectionContent();
  }

  clearAllNotifications() {
    window.StorageManager.clearNotifications();
    if (window.Toast) window.Toast.info('Notifications cleared.');
    this.updateNotificationBadges();
    this.renderSectionContent();
  }

  // -------------------------------------------------------------
  // 7. PROFILE & AVATAR BASE64 UPLOAD
  // -------------------------------------------------------------
  renderProfile() {
    const user = window.StorageManager.getCurrentUser();
    if (!user) {
      return `
        <div class="space-y-6 max-w-2xl animate-fadeIn">
          <div>
            <h2 class="font-display font-black text-3xl text-white">Account Profile</h2>
            <p class="text-sm text-slate-400">Manage your profile, avatar, and vocalist preferences.</p>
          </div>
          <div class="glass-panel p-8 sm:p-12 rounded-3xl border border-purple-800/40 text-center space-y-4">
            <div class="w-16 h-16 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center text-3xl mx-auto shadow-lg">
              <i class="bi bi-person-lock"></i>
            </div>
            <div class="space-y-1">
              <h3 class="font-bold text-white text-xl">Sign In Required</h3>
              <p class="text-xs text-slate-400 max-w-md mx-auto">You are currently browsing as a guest with no account signed in. Please sign in to view and update your profile details.</p>
            </div>
            <div class="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <a href="login.html?redirect=dashboard.html%23profile" class="btn-neon-primary px-6 py-3 text-xs font-bold">
                <i class="bi bi-box-arrow-in-right"></i> Sign In to Account
              </a>
              <a href="index.html" class="btn-neon-outline px-6 py-3 text-xs font-bold">
                <i class="bi bi-house-door"></i> Back to Home Page 1
              </a>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="space-y-6 max-w-2xl">
        <div>
          <h2 class="font-display font-black text-3xl text-white">Account Profile</h2>
          <p class="text-sm text-slate-400">Update personal singer profile, avatar photo, and contact details.</p>
        </div>

        <form id="profileForm" onsubmit="window.dashboard.saveProfile(event)" class="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-800/40 space-y-6">
          
          <!-- Avatar Upload Component -->
          <div class="flex items-center gap-5 pb-6 border-b border-purple-800/40">
            <div class="relative group">
              <img id="profileAvatarPreview" src="${user.avatar}" alt="${user.name}"
                   class="w-20 h-20 rounded-2xl object-cover ring-4 ring-pink-500/50 shadow-xl">
              <label for="avatarFileInput" class="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white text-[10px] font-bold">
                <i class="bi bi-camera text-base"></i> Change
              </label>
              <input type="file" id="avatarFileInput" accept="image/*" class="hidden" onchange="window.dashboard.handleAvatarUpload(event)">
            </div>
            <div>
              <h4 class="font-display font-bold text-white text-base">${user.name}</h4>
              <p class="text-xs text-pink-400 font-semibold">${user.membershipTier || 'Gold VIP Member'}</p>
              <p class="text-[11px] text-slate-500 mt-1">Accepts JPG, PNG, WEBP (Max 2MB)</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">Full Name</label>
              <input type="text" id="profNameInput" value="${user.name}" required
                     class="w-full px-4 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-white text-xs focus:outline-none focus:border-pink-500">
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">Email Address</label>
              <input type="email" id="profEmailInput" value="${user.email}" required
                     class="w-full px-4 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-white text-xs focus:outline-none focus:border-pink-500">
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">Mobile Phone</label>
              <input type="tel" id="profPhoneInput" value="${user.phone || ''}"
                     class="w-full px-4 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-white text-xs focus:outline-none focus:border-pink-500">
            </div>

            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">Membership Tier</label>
              <input type="text" disabled value="${user.membershipTier || 'Gold VIP Member'}"
                     class="w-full px-4 py-2.5 rounded-xl bg-purple-950/20 border border-purple-900/40 text-slate-400 text-xs cursor-not-allowed">
            </div>
          </div>

          <!-- Password Change Section -->
          <div class="pt-4 border-t border-purple-800/40 space-y-4">
            <h4 class="font-display font-bold text-white text-sm uppercase tracking-wider">Change Password</h4>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-300">New Password</label>
                <input type="password" id="profNewPassInput" placeholder="Min 6 characters"
                       class="w-full px-4 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-white text-xs focus:outline-none focus:border-pink-500">
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-300">Confirm Password</label>
                <input type="password" id="profConfirmPassInput" placeholder="Re-type new password"
                       class="w-full px-4 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800/60 text-white text-xs focus:outline-none focus:border-pink-500">
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button type="submit" class="btn-neon-primary px-8 py-2.5 text-xs">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    `;
  }

  handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      if (window.Toast) window.Toast.error('File size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      const preview = document.getElementById('profileAvatarPreview');
      if (preview) preview.src = base64;
      this.pendingAvatarBase64 = base64;
      if (window.Toast) window.Toast.info('Photo preview ready. Click "Save Changes" to apply.');
    };
    reader.readAsDataURL(file);
  }

  saveProfile(e) {
    e.preventDefault();
    const name = document.getElementById('profNameInput').value;
    const email = document.getElementById('profEmailInput').value;
    const phone = document.getElementById('profPhoneInput').value;
    const newPass = document.getElementById('profNewPassInput').value;
    const confirmPass = document.getElementById('profConfirmPassInput').value;

    if (newPass && newPass !== confirmPass) {
      if (window.Toast) window.Toast.error('Passwords do not match.');
      return;
    }

    const updateData = { name, email, phone };
    if (this.pendingAvatarBase64) {
      updateData.avatar = this.pendingAvatarBase64;
    }
    if (newPass) {
      updateData.password = newPass;
    }

    window.StorageManager.updateProfile(updateData);
    if (window.Toast) window.Toast.success('Profile updated successfully!');
    setTimeout(() => location.reload(), 400);
  }

  bindGlobalEvents() {
    // Listen for hashchange so Book a Room or other tabs switch immediately
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      if (h && ['overview', 'book', 'reservations', 'addons', 'favorites', 'notifications', 'profile'].includes(h)) {
        if (this.currentSection !== h) {
          this.setSection(h);
        }
      }
    });

    // Mobile Sidebar Drawer Toggle
    const openBtn = document.getElementById('dashSidebarOpenBtn');
    const closeBtn = document.getElementById('dashSidebarCloseBtn');
    const sidebar = document.getElementById('dashSidebar');
    const overlay = document.getElementById('dashSidebarOverlay');

    if (openBtn && sidebar && overlay) {
      openBtn.addEventListener('click', () => {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
      });
    }

    if (closeBtn && sidebar && overlay) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
      });
    }

    if (overlay && sidebar) {
      overlay.addEventListener('click', () => {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
      });
    }
  }
}

// Global attach
if (typeof window !== 'undefined') {
  window.VoxDashboard = VoxDashboard;
  window.VibeDashboard = VoxDashboard;
}
