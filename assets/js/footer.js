/**
 * VibeVault - Unified Distinctive Lounge Console Footer Component
 * Architectural Nightlife Soundstage layout with Live Equalizer visualizer,
 * Live Venue Marquee Ticker, 5-column grid featuring dedicated Navigation section,
 * shifted Explore & Book column, VIP Clubpass card, and light/dark theme support.
 */

document.addEventListener('DOMContentLoaded', () => {
  const mountPoint = document.getElementById('footer-mount');
  if (!mountPoint) return;

  mountPoint.innerHTML = `
    <footer class="site-unified-footer relative overflow-hidden bg-[#090713] text-slate-300 border-t border-purple-900/40">
      
      <!-- Ambient Glow Accents -->
      <div class="ambient-glow-pink -bottom-32 -left-20 opacity-20 pointer-events-none"></div>
      <div class="ambient-glow-cyan -top-28 -right-20 opacity-20 pointer-events-none"></div>

      <!-- Main Footer Body Container -->
      <div class="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 relative z-10">
        
        <!-- 5-Column Grid with Distinct Architecture and Shifted 'Explore & Book' -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-purple-900/35">
          
          <!-- Column 1: Lounge Soundstage & Brand Specs (Span 3) -->
          <div class="lg:col-span-3 space-y-4">
            <a href="index.html" class="flex items-center gap-3 group">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-cyan-400 p-0.5 shadow-[0_0_18px_rgba(255,0,127,0.4)] group-hover:shadow-[0_0_24px_rgba(0,240,255,0.5)] transition-all">
                <div class="w-full h-full bg-[#0b0914] rounded-[14px] flex items-center justify-center">
                  <i class="bi bi-soundwave text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400"></i>
                </div>
              </div>
              <span class="font-display font-black text-2xl text-white tracking-tight">VIBE<span class="text-neon-pink">VAULT</span></span>
            </a>
            
            <p class="text-xs text-slate-400 leading-relaxed max-w-sm">
              Ultra-luxury private karaoke suites and themed nightlife soundstages. Powered by Meyer Sound pro acoustics, 4K visual immersion, and instant mobile track queuing.
            </p>

            <div class="space-y-2 text-xs text-slate-400 pt-1">
              <div class="flex items-start gap-2.5">
                <i class="bi bi-geo-alt-fill text-pink-400 text-xs mt-0.5"></i>
                <span>Downtown Flagship: 428 Neon Strip Ave, Metro Center</span>
              </div>
              <div class="flex items-center gap-2.5">
                <i class="bi bi-clock-fill text-amber-400 text-xs"></i>
                <span>Operating Hours: 2:00 PM – 4:00 AM (Mon–Sun)</span>
              </div>
              <div class="flex items-center gap-2.5">
                <i class="bi bi-shield-check text-cyan-400 text-xs"></i>
                <span>Studio Soundproofing: 65dB Sound Isolation</span>
              </div>
            </div>

            <!-- Social Media Illuminated Pills -->
            <div class="flex items-center gap-2 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" 
                 class="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-800/50 text-slate-300 hover:text-pink-400 hover:border-pink-500/60 hover:shadow-[0_0_12px_rgba(255,0,127,0.3)] flex items-center justify-center transition text-xs">
                <i class="bi bi-instagram"></i>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" 
                 class="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-800/50 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/60 hover:shadow-[0_0_12px_rgba(0,240,255,0.3)] flex items-center justify-center transition text-xs">
                <i class="bi bi-tiktok"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" 
                 class="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-800/50 text-slate-300 hover:text-rose-400 hover:border-rose-500/60 hover:shadow-[0_0_12px_rgba(244,63,94,0.3)] flex items-center justify-center transition text-xs">
                <i class="bi bi-youtube"></i>
              </a>
              <a href="https://spotify.com" target="_blank" rel="noreferrer" aria-label="Spotify" 
                 class="w-8 h-8 rounded-xl bg-purple-950/60 border border-purple-800/50 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/60 hover:shadow-[0_0_12px_rgba(52,211,153,0.3)] flex items-center justify-center transition text-xs">
                <i class="bi bi-spotify"></i>
              </a>
            </div>
          </div>

          <!-- Column 2: Themed Suites (Span 2) -->
          <div class="lg:col-span-2 space-y-3.5">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_#FF007F]"></span>
              <h4 class="font-display font-bold text-white text-xs uppercase tracking-wider">Themed Suites</h4>
            </div>
            <ul class="space-y-2 text-xs text-slate-400">
              <li>
                <a href="rooms.html?theme=retro" class="hover:text-pink-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-chevron-right text-[10px] text-pink-500/70"></i>
                  <span>Neon Retro 80s</span>
                </a>
              </li>
              <li>
                <a href="rooms.html?theme=kpop" class="hover:text-pink-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-chevron-right text-[10px] text-pink-500/70"></i>
                  <span>K-Pop Idol Studio</span>
                </a>
              </li>
              <li>
                <a href="rooms.html?theme=rock" class="hover:text-pink-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-chevron-right text-[10px] text-pink-500/70"></i>
                  <span>Rock Legends Stage</span>
                </a>
              </li>
              <li>
                <a href="rooms.html?theme=disco" class="hover:text-pink-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-chevron-right text-[10px] text-pink-500/70"></i>
                  <span>Disco Glam Studio</span>
                </a>
              </li>
              <li>
                <a href="rooms.html?theme=jazz" class="hover:text-pink-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-chevron-right text-[10px] text-pink-500/70"></i>
                  <span>Midnight Jazz Lounge</span>
                </a>
              </li>
              <li>
                <a href="rooms.html?theme=vip" class="hover:text-pink-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-chevron-right text-[10px] text-pink-500/70"></i>
                  <span>Royal VIP Penthouse</span>
                </a>
              </li>
              <li class="pt-1.5">
                <a href="rooms.html" class="text-neon-cyan font-bold hover:underline inline-flex items-center gap-1.5 text-xs">
                  <span>Explore All 12 Suites</span>
                  <i class="bi bi-arrow-right text-xs"></i>
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 3: NEW HEADING BEFORE 'Explore & Book' - Navigation (Span 2) -->
          <!-- The listed items under this new heading are strictly the nav section items -->
          <div class="lg:col-span-2 space-y-3.5">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#A855F7]"></span>
              <h4 class="font-display font-bold text-white text-xs uppercase tracking-wider">Navigation</h4>
            </div>
            <ul class="space-y-2 text-xs text-slate-400">
              <li>
                <a href="index.html" class="hover:text-pink-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-house-door text-pink-400 text-xs"></i>
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a href="index2.html" class="hover:text-cyan-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-stars text-cyan-400 text-xs"></i>
                  <span>VIP Nightlife</span>
                </a>
              </li>
              <li>
                <a href="rooms.html" class="hover:text-purple-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-disc text-purple-400 text-xs"></i>
                  <span>Suites</span>
                </a>
              </li>
              <li>
                <a href="songs.html" class="hover:text-pink-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200 font-semibold text-slate-200">
                  <i class="bi bi-music-note-beamed text-pink-400 text-xs"></i>
                  <span>Songbook</span>
                </a>
              </li>
              <li>
                <a href="packages.html" class="hover:text-cyan-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-tag text-cyan-400 text-xs"></i>
                  <span>Pricing</span>
                </a>
              </li>
              <li>
                <a href="blog.html" class="hover:text-purple-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-journal-richtext text-purple-400 text-xs"></i>
                  <span>Blog</span>
                </a>
              </li>
              <li>
                <a href="contact.html" class="hover:text-pink-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-envelope text-pink-400 text-xs"></i>
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 4: Explore & Book (Span 2, Shifted to a little right with extra left padding/indent) -->
          <div class="lg:col-span-2 space-y-3.5 lg:pl-6 xl:pl-8 lg:border-l lg:border-purple-800/20">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]"></span>
              <h4 class="font-display font-bold text-white text-xs uppercase tracking-wider">Explore & Book</h4>
            </div>
            <ul class="space-y-2 text-xs text-slate-400">
              <li>
                <a href="dashboard.html#book" class="hover:text-cyan-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-calendar-plus text-cyan-400 text-xs"></i>
                  <span>Instant Booking</span>
                </a>
              </li>
              <li>
                <a href="packages.html" class="hover:text-cyan-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-box2-heart text-cyan-400 text-xs"></i>
                  <span>VIP Party Packages</span>
                </a>
              </li>
              <li>
                <a href="packages.html#addons" class="hover:text-cyan-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-cup-straw text-cyan-400 text-xs"></i>
                  <span>Food & Drink Add-ons</span>
                </a>
              </li>
              <li>
                <a href="dashboard.html" class="hover:text-cyan-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-speedometer2 text-cyan-400 text-xs"></i>
                  <span>Customer Portal</span>
                </a>
              </li>
              <li>
                <a href="terms.html#rules" class="hover:text-cyan-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-shield-check text-cyan-400 text-xs"></i>
                  <span>House Rules</span>
                </a>
              </li>
              <li>
                <a href="terms.html#cancellation" class="hover:text-cyan-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-calendar2-x text-cyan-400 text-xs"></i>
                  <span>Cancellation Policy</span>
                </a>
              </li>
              <li>
                <a href="contact.html#map" class="hover:text-cyan-400 hover:translate-x-1 inline-flex items-center gap-2 transition duration-200">
                  <i class="bi bi-pin-map text-cyan-400 text-xs"></i>
                  <span>Interactive Map</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 5: VIP Lounge Squad Card & Newsletter (Span 3) -->
          <div class="lg:col-span-3">
            <div class="footer-vip-card p-5 rounded-3xl bg-gradient-to-b from-[#181135]/90 to-[#0e0920]/90 border border-purple-700/40 space-y-3.5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              
              <!-- Subtle decorative corner glow -->
              <div class="absolute -top-12 -right-12 w-24 h-24 bg-pink-500/20 rounded-full blur-xl pointer-events-none"></div>

              <div class="flex items-center justify-between relative z-10">
                <span class="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                  <i class="bi bi-stars"></i> VIP Squad Clubpass
                </span>
                <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-500/25 border border-pink-500/40 text-pink-300">
                  15% OFF
                </span>
              </div>

              <p class="text-xs text-slate-400 leading-relaxed relative z-10">
                Join our VIP vocalist circle for secret weekday promo codes, priority booking slots, and complimentary welcome cocktail vouchers.
              </p>

              <form id="footerNewsletterForm" class="space-y-2 relative z-10">
                <div class="relative">
                  <input type="email" id="newsletterEmailInput" required placeholder="Enter your email address..."
                         class="w-full px-3.5 py-2.5 rounded-xl bg-purple-950/70 border border-purple-800/60 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/40 transition">
                </div>
                <button type="submit" class="btn-neon-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,0,127,0.35)]">
                  <span>Claim 15% VIP Clubpass</span>
                  <i class="bi bi-arrow-right text-xs"></i>
                </button>
              </form>

              <div class="pt-1 flex items-center justify-between text-[10px] text-slate-500 relative z-10">
                <span>Instant confirmation code.</span>
                <a href="tel:+18008695686" class="text-cyan-400 hover:underline flex items-center gap-1">
                  <i class="bi bi-headset"></i> Call Concierge
                </a>
              </div>
            </div>
          </div>

        </div>

        <!-- Footer Bottom Bar (Architectural Console Deck) -->
        <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div class="flex items-center gap-3">
            <p>© 2026 <span class="text-white font-semibold footer-brand-name">VibeVault Entertainment Group</span>. All rights reserved.</p>
            <span class="hidden md:inline px-2 py-0.5 rounded-md bg-purple-950/50 border border-purple-800/40 text-[10px] text-purple-300">
              Meyer Sound® Certified
            </span>
          </div>
          
          <div class="flex flex-wrap items-center gap-4 text-xs">
            <a href="terms.html#rules" id="footerHouseRulesLink" class="footer-policy-link hover:text-slate-300 transition">House Rules</a>
            <span class="text-purple-800">•</span>
            <a href="terms.html#cancellation" id="footerCancellationLink" class="footer-policy-link hover:text-slate-300 transition">Cancellation Policy</a>
            <span class="text-purple-800">•</span>
            <a href="terms.html#privacy" class="footer-policy-link hover:text-slate-300 transition">Privacy</a>
            <span class="text-purple-800">•</span>
            <a href="contact.html" class="hover:text-slate-300 transition">Directions</a>
          </div>
        </div>

      </div>
    </footer>
  `;

  // Terms anchor click interceptor for in-page smooth navigation & highlighting
  document.querySelectorAll('a[href*="terms.html#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      const parts = href.split('#');
      const hash = parts[1];
      if (window.location.pathname.endsWith('terms.html')) {
        e.preventDefault();
        window.location.hash = hash;
        if (typeof window.handleTermsHash === 'function') {
          window.handleTermsHash();
        }
      }
    });
  });

  // Newsletter Form Handler
  const form = document.getElementById('footerNewsletterForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('newsletterEmailInput');
      const email = input.value.trim();

      if (email && email.includes('@')) {
        if (window.Toast) {
          window.Toast.success(`Thanks for joining! We sent your 15% VIP code to ${email}`, 'VIP Pass Activated! 🎉');
        }
        if (window.StorageManager) {
          window.StorageManager.addNotification('VIP Code 🎟️', 'Use code VIBEVIP15 on your next booking for 15% off!', 'promo');
        }
        input.value = '';
      }
    });
  }
});
