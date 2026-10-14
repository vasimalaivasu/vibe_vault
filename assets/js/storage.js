/**
 * VibeVault - Unified LocalStorage & Demo Data Manager
 * Handles persistent storage, authentication sessions, demo seed data,
 * room availability slots, reservations status progression, favorites and preferences.
 */

const STORAGE_KEYS = {
  THEME: 'vox_theme',
  DIRECTION: 'vox_direction',
  USER: 'vox_current_user',
  USERS_LIST: 'vox_users_list',
  RESERVATIONS: 'vox_reservations',
  FAVORITES: 'vox_favorites',
  NOTIFICATIONS: 'vox_notifications',
  DRAFT_BOOKING: 'vox_draft_booking'
};

const StorageManager = {
  // Safe helper get / set
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`LocalStorage read error for ${key}:`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`LocalStorage write error for ${key}:`, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`LocalStorage remove error for ${key}:`, e);
    }
  },

  // -------------------------------------------------------------
  // INITIALIZATION & DEMO SEED DATA
  // -------------------------------------------------------------
  init() {
    // Seed Demo Users if not present
    if (!this.get(STORAGE_KEYS.USERS_LIST)) {
      const demoUsers = [
        {
          id: 'usr-demo-001',
          name: 'Alex Vance',
          email: 'demo@partyroom.com',
          password: 'Demo@123',
          phone: '+1 (555) 839-2041',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          loyaltyPoints: 420,
          totalSpent: 945,
          membershipTier: 'Gold VIP Vocalist',
          createdAt: '2026-08-15'
        }
      ];
      this.set(STORAGE_KEYS.USERS_LIST, demoUsers);
    }

    // Ensure NO account is signed in by default. Initial visits always start signed out.
    // Clean up any legacy auto-logged demo user from previous sessions.
    const currentUser = this.get(STORAGE_KEYS.USER);
    if (currentUser && (currentUser.id === 'usr-demo-001' || currentUser.email === 'demo@partyroom.com')) {
      const wasExplicit = localStorage.getItem('vox_explicit_demo_login');
      if (!wasExplicit) {
        this.remove(STORAGE_KEYS.USER);
      }
    }
    localStorage.setItem('vox_system_initialized', 'true');

    // Default to Light Theme initially
    if (!localStorage.getItem('vibevault_light_initialized')) {
      this.setTheme('light');
      localStorage.setItem('vibevault_light_initialized', 'true');
    }

    // Seed Sample Reservations
    if (!this.get(STORAGE_KEYS.RESERVATIONS)) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 2);

      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - 12);

      const formatDate = (d) => d.toISOString().split('T')[0];

      const sampleReservations = [
        {
          id: 'KP-2026-00128',
          roomId: 'room-disco-glam',
          roomName: 'Disco Glam Studio',
          roomTheme: 'Disco & Funk',
          capacityTier: 'party',
          date: formatDate(tomorrow),
          timeSlots: ['20:00', '21:00', '22:00'],
          timeText: '8:00 PM – 11:00 PM (3 Hours)',
          guests: 12,
          occasion: 'Birthday Bash',
          packageId: 'pkg-birthday-bash',
          packageName: 'Birthday Bash Package',
          addOns: [
            { id: 'addon-birthday-cake', name: 'Signature Celebration Cake', qty: 1, price: 50 },
            { id: 'addon-beverage-bucket', name: 'Ice Beverage Bucket', qty: 2, price: 45 }
          ],
          hourlyRate: 100,
          hoursCount: 3,
          roomSubtotal: 349,
          addonsSubtotal: 140,
          taxes: 39.12,
          discount: 35.00,
          promoCode: 'PARTY10',
          totalAmount: 493.12,
          depositPaid: 100.00,
          balanceDue: 393.12,
          status: 'Confirmed', // Pending -> Confirmed -> Checked In -> In Session -> Completed | Cancelled
          specialRequests: 'Sparkler candles on cake; extra napkins please!',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'KP-2026-00127',
          roomId: 'room-kpop-studio',
          roomName: 'K-Pop Idol Studio',
          roomTheme: 'K-Pop & Idol',
          capacityTier: 'standard',
          date: formatDate(today),
          timeSlots: ['19:00', '20:00'],
          timeText: '7:00 PM – 9:00 PM (2 Hours)',
          guests: 6,
          occasion: 'Friends Hangout',
          packageId: 'pkg-party-starter',
          packageName: 'Party Starter Package',
          addOns: [
            { id: 'addon-pro-mics', name: 'Studio Vocal Mic Upgrade', qty: 1, price: 25 }
          ],
          hourlyRate: 65,
          hoursCount: 2,
          roomSubtotal: 159,
          addonsSubtotal: 25,
          taxes: 14.72,
          discount: 0,
          promoCode: '',
          totalAmount: 198.72,
          depositPaid: 50.00,
          balanceDue: 148.72,
          status: 'In Session',
          specialRequests: 'Lightsticks pre-synced to BTS playlist.',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'KP-2026-00115',
          roomId: 'room-retro-80s',
          roomName: 'Neon Retro 80s',
          roomTheme: 'Retro Synthwave',
          capacityTier: 'mini',
          date: formatDate(pastDate),
          timeSlots: ['21:00', '22:00'],
          timeText: '9:00 PM – 11:00 PM (2 Hours)',
          guests: 3,
          occasion: 'Date Night',
          packageId: 'pkg-jam-session',
          packageName: 'Jam Session Starter',
          addOns: [],
          hourlyRate: 45,
          hoursCount: 2,
          roomSubtotal: 90,
          addonsSubtotal: 0,
          taxes: 7.20,
          discount: 0,
          promoCode: '',
          totalAmount: 97.20,
          depositPaid: 97.20,
          balanceDue: 0.00,
          status: 'Completed',
          specialRequests: '',
          createdAt: new Date(Date.now() - 86400000 * 14).toISOString()
        },
        {
          id: 'KP-2026-00098',
          roomId: 'room-rock-legends',
          roomName: 'Rock Legends Stage',
          roomTheme: 'Rock & Metal',
          capacityTier: 'party',
          date: '2026-09-10',
          timeSlots: ['22:00', '23:00'],
          timeText: '10:00 PM – Midnight (2 Hours)',
          guests: 10,
          occasion: 'Bachelorette Party',
          packageId: null,
          packageName: 'Hourly Room Hire',
          addOns: [],
          hourlyRate: 95,
          hoursCount: 2,
          roomSubtotal: 190,
          addonsSubtotal: 0,
          taxes: 15.20,
          discount: 0,
          promoCode: '',
          totalAmount: 205.20,
          depositPaid: 50.00,
          balanceDue: 155.20,
          status: 'Cancelled',
          specialRequests: 'Cancelled due to travel rescheduling.',
          createdAt: '2026-09-02T10:00:00Z'
        }
      ];

      this.set(STORAGE_KEYS.RESERVATIONS, sampleReservations);
    }

    // Seed Sample Favorites (default clean empty wishlist unless customized by user)
    const existingFavs = this.get(STORAGE_KEYS.FAVORITES);
    if (!existingFavs || (Array.isArray(existingFavs) && existingFavs.length === 3 && existingFavs.includes('room-retro-80s') && existingFavs.includes('room-disco-glam') && existingFavs.includes('room-kpop-studio') && !localStorage.getItem('vox_user_customized_favs'))) {
      this.set(STORAGE_KEYS.FAVORITES, []);
    }

    // Seed Sample Notifications
    if (!this.get(STORAGE_KEYS.NOTIFICATIONS)) {
      const sampleNotifications = [
        {
          id: 'notif-1',
          title: 'Upcoming Party Reminder! 🎤',
          message: 'Your booking KP-2026-00128 at Disco Glam Studio is coming up soon. Review details or add last-minute snacks.',
          time: '2 hours ago',
          read: false,
          type: 'booking'
        },
        {
          id: 'notif-2',
          title: 'Loyalty Points Earned 🌟',
          message: 'You earned +120 VoxVocal loyalty points from your previous session at Neon Retro 80s.',
          time: '1 day ago',
          read: true,
          type: 'reward'
        },
        {
          id: 'notif-3',
          title: 'Weekend Promo Active 🎉',
          message: 'Use code PARTY10 at checkout to unlock 10% off any package with 5+ guests.',
          time: '3 days ago',
          read: true,
          type: 'promo'
        }
      ];
      this.set(STORAGE_KEYS.NOTIFICATIONS, sampleNotifications);
    }

    // Initialize Theme and Direction
    this.applyTheme(this.getTheme());
    this.applyDirection(this.getDirection());
  },

  // -------------------------------------------------------------
  // AUTHENTICATION & PROFILE
  // -------------------------------------------------------------
  getCurrentUser() {
    return this.get(STORAGE_KEYS.USER, null);
  },

  login(email, password) {
    const users = this.get(STORAGE_KEYS.USERS_LIST, []);
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    
    if (!user) {
      return { success: false, message: 'Account not found with this email.' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Invalid email or password.' };
    }

    this.set(STORAGE_KEYS.USER, user);
    localStorage.removeItem('vox_user_logged_out');
    localStorage.setItem('vox_system_initialized', 'true');
    return { success: true, user };
  },

  register(name, email, password, phone = '') {
    const users = this.get(STORAGE_KEYS.USERS_LIST, []);
    const existing = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || '+1 (555) 000-0000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      loyaltyPoints: 100, // Welcome bonus
      totalSpent: 0,
      membershipTier: 'Silver Member',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.set(STORAGE_KEYS.USERS_LIST, users);
    this.set(STORAGE_KEYS.USER, newUser);
    localStorage.removeItem('vox_user_logged_out');
    localStorage.setItem('vox_system_initialized', 'true');

    // Welcome notification
    this.addNotification('Welcome to VibeVault! 🎶', 'You received 100 welcome loyalty points. Start exploring rooms to book your stage!', 'reward');

    return { success: true, user: newUser };
  },

  logout() {
    this.remove(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem('vox_explicit_demo_login');
    localStorage.setItem('vox_system_initialized', 'true');
    localStorage.setItem('vox_user_logged_out', 'true');
    try { sessionStorage.clear(); } catch(e) {}
  },

  updateProfile(profileData) {
    const user = this.getCurrentUser();
    if (!user) return { success: false, message: 'Not logged in' };

    const updated = { ...user, ...profileData };
    this.set(STORAGE_KEYS.USER, updated);

    // Also update in users list
    const users = this.get(STORAGE_KEYS.USERS_LIST, []);
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = updated;
      this.set(STORAGE_KEYS.USERS_LIST, users);
    }

    return { success: true, user: updated };
  },

  // -------------------------------------------------------------
  // RESERVATIONS & BOOKINGS
  // -------------------------------------------------------------
  getReservations() {
    return this.get(STORAGE_KEYS.RESERVATIONS, []);
  },

  getReservationById(id) {
    const list = this.getReservations();
    return list.find(r => r.id === id) || null;
  },

  createReservation(bookingData) {
    const reservations = this.getReservations();
    const id = 'KP-2026-' + String(reservations.length + 130).padStart(5, '0');

    const newBooking = {
      id,
      ...bookingData,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    reservations.unshift(newBooking);
    this.set(STORAGE_KEYS.RESERVATIONS, reservations);

    // Add reward points & notification
    const user = this.getCurrentUser();
    if (user) {
      const earnedPoints = Math.round((newBooking.totalAmount || 100) * 0.5);
      this.updateProfile({
        loyaltyPoints: (user.loyaltyPoints || 0) + earnedPoints,
        totalSpent: (user.totalSpent || 0) + (newBooking.totalAmount || 0)
      });
    }

    this.addNotification(
      'Reservation Confirmed! 🎉',
      `Booking ${id} for ${newBooking.roomName} on ${newBooking.date} is confirmed. View details in your dashboard.`,
      'booking'
    );

    return newBooking;
  },

  updateReservationStatus(id, newStatus) {
    const list = this.getReservations();
    const item = list.find(r => r.id === id);
    if (item) {
      item.status = newStatus;
      this.set(STORAGE_KEYS.RESERVATIONS, list);

      this.addNotification(
        `Reservation ${newStatus} 📋`,
        `Booking ${id} status updated to "${newStatus}".`,
        'booking'
      );
      return true;
    }
    return false;
  },

  cancelReservation(id) {
    return this.updateReservationStatus(id, 'Cancelled');
  },

  rescheduleReservation(id, newDate, newSlots, newTimeText) {
    const list = this.getReservations();
    const item = list.find(r => r.id === id);
    if (item) {
      item.date = newDate;
      item.timeSlots = newSlots;
      item.timeText = newTimeText || `${newSlots[0]} – ${newSlots[newSlots.length - 1]} (${newSlots.length} Hrs)`;
      item.status = 'Confirmed';
      this.set(STORAGE_KEYS.RESERVATIONS, list);

      this.addNotification(
        'Reservation Rescheduled 🗓️',
        `Booking ${id} moved to ${newDate} at ${item.timeText}.`,
        'booking'
      );
      return true;
    }
    return false;
  },

  addAddonToReservation(id, addon, qty = 1) {
    const list = this.getReservations();
    const booking = list.find(r => r.id === id);
    if (!booking) return false;

    booking.addOns = booking.addOns || [];
    const existing = booking.addOns.find(a => a.id === addon.id);

    if (existing) {
      existing.qty += qty;
    } else {
      booking.addOns.push({
        id: addon.id,
        name: addon.name,
        price: addon.price,
        qty: qty
      });
    }

    // Recalculate
    const addedAmount = addon.price * qty;
    booking.addonsSubtotal = (booking.addonsSubtotal || 0) + addedAmount;
    booking.totalAmount = (booking.totalAmount || 0) + addedAmount;
    booking.balanceDue = (booking.balanceDue || 0) + addedAmount;

    this.set(STORAGE_KEYS.RESERVATIONS, list);
    this.addNotification(
      'Add-on Added! 🥂',
      `Added ${qty}x ${addon.name} to booking ${id}. Total updated.`,
      'booking'
    );
    return true;
  },

  // Check if a room's slot is booked on a date
  isSlotBooked(roomId, dateString, slotTime) {
    const reservations = this.getReservations();
    return reservations.some(r => {
      if (r.status === 'Cancelled') return false;
      if (r.roomId !== roomId) return false;
      if (r.date !== dateString) return false;
      return Array.isArray(r.timeSlots) && r.timeSlots.includes(slotTime);
    });
  },

  // -------------------------------------------------------------
  // FAVORITES
  // -------------------------------------------------------------
  getFavorites() {
    return this.get(STORAGE_KEYS.FAVORITES, []);
  },

  isFavorite(roomId) {
    const favs = this.getFavorites();
    return favs.includes(roomId);
  },

  toggleFavorite(roomId) {
    let favs = this.getFavorites();
    let isAdded = false;

    if (favs.includes(roomId)) {
      favs = favs.filter(id => id !== roomId);
      isAdded = false;
    } else {
      favs.push(roomId);
      isAdded = true;
    }

    this.set(STORAGE_KEYS.FAVORITES, favs);
    try { localStorage.setItem('vox_user_customized_favs', 'true'); } catch(e) {}
    return isAdded;
  },

  // -------------------------------------------------------------
  // NOTIFICATIONS
  // -------------------------------------------------------------
  getNotifications() {
    return this.get(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  addNotification(title, message, type = 'info') {
    const notifs = this.getNotifications();
    const newNotif = {
      id: 'notif-' + Date.now(),
      title,
      message,
      time: 'Just now',
      read: false,
      type
    };
    notifs.unshift(newNotif);
    this.set(STORAGE_KEYS.NOTIFICATIONS, notifs);

    // Dispatch custom event for navbar badge update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vox_notification_added', { detail: newNotif }));
    }
  },

  markNotificationRead(id) {
    const notifs = this.getNotifications();
    const item = notifs.find(n => n.id === id);
    if (item) {
      item.read = true;
      this.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  },

  clearNotifications() {
    this.set(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  // -------------------------------------------------------------
  // DRAFT BOOKING
  // -------------------------------------------------------------
  getDraftBooking() {
    return this.get(STORAGE_KEYS.DRAFT_BOOKING, null);
  },

  setDraftBooking(draft) {
    this.set(STORAGE_KEYS.DRAFT_BOOKING, draft);
  },

  clearDraftBooking() {
    this.remove(STORAGE_KEYS.DRAFT_BOOKING);
  },

  // -------------------------------------------------------------
  // THEME & RTL PREFERENCES
  // -------------------------------------------------------------
  getTheme() {
    return this.get(STORAGE_KEYS.THEME, 'light'); // Default light theme
  },

  setTheme(theme) {
    this.set(STORAGE_KEYS.THEME, theme);
    this.applyTheme(theme);
  },

  toggleTheme() {
    const next = this.getTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    return next;
  },

  applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
      root.classList.add('light');
      if (document.body) {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        document.body.setAttribute('data-theme', 'light');
      }
    } else {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
      root.classList.remove('light');
      if (document.body) {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        document.body.setAttribute('data-theme', 'dark');
      }
    }
  },

  getDirection() {
    return this.get(STORAGE_KEYS.DIRECTION, 'ltr');
  },

  setDirection(dir) {
    this.set(STORAGE_KEYS.DIRECTION, dir);
    this.applyDirection(dir);
  },

  toggleDirection() {
    const next = this.getDirection() === 'ltr' ? 'rtl' : 'ltr';
    this.setDirection(next);
    return next;
  },

  applyDirection(dir) {
    const root = document.documentElement;
    root.setAttribute('dir', dir);
    if (dir === 'rtl') {
      root.classList.add('rtl');
    } else {
      root.classList.remove('rtl');
    }
  },

  // -------------------------------------------------------------
  // RESET DEMO DATA
  // -------------------------------------------------------------
  resetDemoData() {
    Object.values(STORAGE_KEYS).forEach(k => {
      localStorage.removeItem(k);
    });
    this.init();
    return true;
  }
};

// Auto-run on load
if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
  StorageManager.init();
}
