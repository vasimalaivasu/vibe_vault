/**
 * VibeVault - Multi-Step Interactive Booking Engine
 * Stepper wizard: Room -> Date & Time Slots -> Guests & Occasion -> Add-ons -> Review & Confirm
 * Features custom vanilla JS calendar, multi-hour consecutive slot selection,
 * real-time LocalStorage availability conflict prevention, promo codes, and ICS calendar generator.
 */

class VoxBookingStepper {
  constructor(containerId = 'bookingStepperContainer') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    window.voxBooking = this;
    window.vibeBooking = this;

    this.currentStep = 1;
    this.totalSteps = 5;

    // Booking State
    this.state = {
      selectedRoom: null,
      selectedDate: null,
      selectedSlots: [], // array of strings e.g. ['20:00', '21:00']
      guestsCount: 4,
      occasion: 'Friends Hangout',
      specialRequests: '',
      selectedPackage: null,
      addons: {}, // { [addonId]: quantity }
      promoCode: '',
      discountPercent: 0,
      appliedPromo: null
    };

    // Calendar state
    this.currentCalYear = new Date().getFullYear();
    this.currentCalMonth = new Date().getMonth();

    this.timeSlotList = [
      { time: '12:00', label: '12:00 PM', peak: false },
      { time: '13:00', label: '1:00 PM', peak: false },
      { time: '14:00', label: '2:00 PM', peak: false },
      { time: '15:00', label: '3:00 PM', peak: false },
      { time: '16:00', label: '4:00 PM', peak: false },
      { time: '17:00', label: '5:00 PM', peak: false },
      { time: '18:00', label: '6:00 PM', peak: false },
      { time: '19:00', label: '7:00 PM', peak: true },
      { time: '20:00', label: '8:00 PM', peak: true },
      { time: '21:00', label: '9:00 PM', peak: true },
      { time: '22:00', label: '10:00 PM', peak: true },
      { time: '23:00', label: '11:00 PM', peak: true },
      { time: '00:00', label: '12:00 AM', peak: true },
      { time: '01:00', label: '1:00 AM', peak: true }
    ];

    this.init();
  }

  init() {
    // Check prefilled query parameters or draft
    const params = new URLSearchParams(window.location.search);
    const preRoomId = params.get('roomId');
    const prePackageId = params.get('packageId');
    const preDate = params.get('date');
    const preGuests = params.get('guests');

    if (preRoomId && window.VOX_ROOMS) {
      const found = window.VOX_ROOMS.find(r => r.id === preRoomId);
      if (found) this.state.selectedRoom = found;
    } else if (window.VOX_ROOMS && window.VOX_ROOMS.length > 0) {
      this.state.selectedRoom = window.VOX_ROOMS[0]; // default first room
    }

    if (prePackageId && window.VOX_PACKAGES) {
      const foundPkg = window.VOX_PACKAGES.find(p => p.id === prePackageId);
      if (foundPkg) this.state.selectedPackage = foundPkg;
    }

    if (preDate) {
      this.state.selectedDate = preDate;
    } else {
      // Default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.state.selectedDate = tomorrow.toISOString().split('T')[0];
    }

    if (preGuests) {
      const g = parseInt(preGuests, 10);
      if (!isNaN(g)) this.state.guestsCount = g;
    }

    // Default select 2 slots if available
    this.state.selectedSlots = ['20:00', '21:00'];

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <!-- Stepper Progress Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between relative max-w-3xl mx-auto px-4">
          <!-- Connector line -->
          <div class="stepper-track absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-purple-950 -z-0">
            <div class="h-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-500"
                 style="width: ${((this.currentStep - 1) / (this.totalSteps - 1)) * 100}%"></div>
          </div>

          <!-- Step 1 -->
          ${this.renderStepBullet(1, 'Room', 'bi-door-open')}
          <!-- Step 2 -->
          ${this.renderStepBullet(2, 'Date & Slots', 'bi-calendar3')}
          <!-- Step 3 -->
          ${this.renderStepBullet(3, 'Party Details', 'bi-people')}
          <!-- Step 4 -->
          ${this.renderStepBullet(4, 'Add-ons', 'bi-basket2')}
          <!-- Step 5 -->
          ${this.renderStepBullet(5, 'Review & Pay', 'bi-check2-circle')}
        </div>
      </div>

      <!-- Main Step View Body -->
      <div class="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-800/40 relative">
        <div id="stepContentContainer">
          ${this.renderCurrentStepContent()}
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-8 pt-6 border-t border-purple-800/40 flex items-center justify-between gap-4">
          ${this.currentStep > 1 ? `
            <button id="stepperPrevBtn" class="btn-neon-outline px-6 py-2.5 text-sm">
              <i class="bi bi-arrow-left"></i> Previous Step
            </button>
          ` : `<div></div>`}

          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-400 hidden sm:inline">
              Step ${this.currentStep} of ${this.totalSteps}
            </span>

            ${this.currentStep < this.totalSteps ? `
              <button id="stepperNextBtn" class="btn-neon-primary px-8 py-2.5 text-sm">
                <span>Continue</span>
                <i class="bi bi-arrow-right"></i>
              </button>
            ` : `
              <button id="stepperConfirmBtn" class="btn-neon-primary px-10 py-3 text-sm shadow-[0_0_25px_rgba(255,0,127,0.5)]">
                <i class="bi bi-lightning-charge-fill text-amber-300"></i>
                <span>Confirm & Lock Stage</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  renderStepBullet(stepNum, label, icon) {
    const isCompleted = stepNum < this.currentStep;
    const isCurrent = stepNum === this.currentStep;

    let bulletStateClass = 'stepper-bullet-upcoming';
    let labelStateClass = 'stepper-label-upcoming';
    let iconHtml = `<i class="bi ${icon}"></i>`;

    if (isCompleted) {
      bulletStateClass = 'stepper-bullet-completed';
      labelStateClass = 'stepper-label-completed';
      iconHtml = `<i class="bi bi-check-lg"></i>`;
    } else if (isCurrent) {
      bulletStateClass = 'stepper-bullet-current';
      labelStateClass = 'stepper-label-current';
    }

    return `
      <div class="flex flex-col items-center gap-2 relative z-10 cursor-pointer group" onclick="window.voxBooking.goToStep(${stepNum})">
        <div class="stepper-bullet ${bulletStateClass} w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-sm sm:text-base">
          ${iconHtml}
        </div>
        <span class="stepper-label ${labelStateClass} text-[11px] sm:text-xs font-semibold text-center whitespace-nowrap transition-colors">
          ${label}
        </span>
      </div>
    `;
  }

  renderCurrentStepContent() {
    switch (this.currentStep) {
      case 1: return this.renderStep1Room();
      case 2: return this.renderStep2DateTime();
      case 3: return this.renderStep3Guests();
      case 4: return this.renderStep4Addons();
      case 5: return this.renderStep5Review();
      default: return '';
    }
  }

  // -------------------------------------------------------------
  // STEP 1: ROOM SELECTION
  // -------------------------------------------------------------
  renderStep1Room() {
    const rooms = window.VOX_ROOMS || [];
    const selected = this.state.selectedRoom;

    return `
      <div class="space-y-6">
        <div>
          <h3 class="font-display font-black text-2xl text-white">Choose Your Themed Stage</h3>
          <p class="text-sm text-slate-400">Select the private suite that fits your squad's music vibe and guest capacity.</p>
        </div>

        <!-- Selected Status Banner -->
        ${selected ? `
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-purple-950/60 border border-pink-500/50 shadow-[0_0_20px_rgba(255,0,127,0.2)] text-xs">
            <div class="flex items-center gap-2.5 text-white">
              <span class="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
              <span>Currently Selected: <strong class="text-pink-300 font-bold">${selected.name}</strong> (${selected.capacityText} • $${selected.pricePerHour}/hr)</span>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" onclick="window.voxBooking.goToStep(2)" class="btn-neon-primary px-3.5 py-1 text-xs rounded-xl font-bold flex items-center gap-1 shadow-sm">
                <span>Continue to Slots</span> <i class="bi bi-arrow-right"></i>
              </button>
              <button type="button" onclick="window.voxBooking.deselectRoom()" class="px-3 py-1 text-xs rounded-xl font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition flex items-center gap-1">
                <i class="bi bi-x-circle"></i> <span>Deselect</span>
              </button>
            </div>
          </div>
        ` : `
          <div class="flex items-center justify-between p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-xs text-slate-300">
            <div class="flex items-center gap-2">
              <i class="bi bi-door-closed text-pink-400 text-sm"></i>
              <span>No suite selected. Click any room card below to select your stage.</span>
            </div>
            <span class="text-[11px] text-slate-400 hidden sm:inline">12 themed suites available</span>
          </div>
        `}

        <!-- Filter tabs for quick room selection -->
        <div class="flex flex-wrap gap-2 pb-2">
          <button type="button" class="room-tier-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-pink-600 text-white" data-tier="all">All Capacities</button>
          <button type="button" class="room-tier-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-950/70 text-slate-300 hover:text-white" data-tier="mini">Mini (2–4)</button>
          <button type="button" class="room-tier-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-950/70 text-slate-300 hover:text-white" data-tier="standard">Standard (5–8)</button>
          <button type="button" class="room-tier-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-950/70 text-slate-300 hover:text-white" data-tier="party">Party (9–15)</button>
          <button type="button" class="room-tier-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-950/70 text-slate-300 hover:text-white" data-tier="vip">VIP (16–25)</button>
          <button type="button" class="room-tier-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-950/70 text-slate-300 hover:text-white" data-tier="grand">Grand Hall (26–40)</button>
        </div>

        <!-- Rooms Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="stepperRoomsGrid">
          ${rooms.map(room => {
            const isSelected = selected && selected.id === room.id;
            return `
              <div class="room-card glass-panel cursor-pointer p-4 rounded-2xl border-2 transition-all ${isSelected ? 'border-pink-500 shadow-[0_0_25px_rgba(255,0,127,0.4)] ring-2 ring-pink-500/30' : 'border-purple-800/40 hover:border-cyan-500/50'}"
                   onclick="${isSelected ? `window.voxBooking.deselectRoom('${room.id}')` : `window.voxBooking.selectRoom('${room.id}', true)`}">
                
                <div class="relative h-44 rounded-xl overflow-hidden mb-3">
                  <img src="${room.image}" alt="${room.name}" class="card-img w-full h-full object-cover">
                  <div class="absolute inset-0 bg-gradient-to-t from-[#0b0914] via-transparent to-transparent"></div>
                  
                  <span class="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0b0914]/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    <i class="bi bi-people-fill mr-1"></i> ${room.capacityText}
                  </span>

                  ${isSelected ? `
                    <span class="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-pink-600 text-white shadow-md flex items-center gap-1">
                      <i class="bi bi-check2-circle"></i> Selected
                    </span>
                  ` : ''}

                  <span class="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl text-xs font-black bg-pink-600 text-white shadow-lg">
                    $${room.pricePerHour}/hr
                  </span>
                </div>

                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-display font-bold text-white text-base">${room.name}</h4>
                    <div class="flex items-center gap-1 text-xs text-amber-400 font-bold">
                      <i class="bi bi-star-fill"></i> ${room.rating}
                    </div>
                  </div>
                  <p class="text-xs text-slate-400 line-clamp-2">${room.tagline}</p>
                </div>

                <div class="mt-3 pt-3 border-t border-purple-800/40 flex items-center justify-between text-xs">
                  <span class="text-purple-300 font-semibold">${room.theme}</span>
                  ${isSelected ? `
                    <button type="button" onclick="event.stopPropagation(); window.voxBooking.deselectRoom('${room.id}');"
                            class="px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition shadow-sm">
                      <i class="bi bi-x-circle"></i> <span>Deselect</span>
                    </button>
                  ` : `
                    <button type="button" onclick="event.stopPropagation(); window.voxBooking.selectRoom('${room.id}', true);"
                            class="btn-neon-primary px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,0,127,0.3)]">
                      <span>Book This Room</span> <i class="bi bi-arrow-right"></i>
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // STEP 2: DATE & TIME SLOTS
  // -------------------------------------------------------------
  renderStep2DateTime() {
    const selectedDate = this.state.selectedDate;
    const room = this.state.selectedRoom;

    return `
      <div class="space-y-6">
        <div>
          <h3 class="font-display font-black text-2xl text-white">Select Date & Time Slots</h3>
          <p class="text-sm text-slate-400">Pick consecutive hours. Peak evening hours (7 PM – 2 AM) feature full laser and light show mode.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left: Calendar Widget -->
          <div class="lg:col-span-6 glass-panel p-5 rounded-2xl border border-purple-800/50">
            <div class="flex items-center justify-between pb-4 mb-4 border-b border-purple-800/40">
              <h4 class="font-display font-bold text-white" id="calMonthTitle">
                ${new Date(this.currentCalYear, this.currentCalMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h4>
              <div class="flex items-center gap-2">
                <button type="button" onclick="window.voxBooking.changeMonth(-1)" class="cal-nav-btn w-8 h-8 rounded-lg bg-purple-950/60 hover:bg-pink-600 text-white flex items-center justify-center transition">
                  <i class="bi bi-chevron-left text-xs"></i>
                </button>
                <button type="button" onclick="window.voxBooking.changeMonth(1)" class="cal-nav-btn w-8 h-8 rounded-lg bg-purple-950/60 hover:bg-pink-600 text-white flex items-center justify-center transition">
                  <i class="bi bi-chevron-right text-xs"></i>
                </button>
              </div>
            </div>

            <!-- Days of Week -->
            <div class="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-500 mb-2">
              <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
            </div>

            <!-- Calendar Days Grid -->
            <div class="grid grid-cols-7 gap-1.5" id="calDaysGrid">
              ${this.generateCalendarDays()}
            </div>
            
            <p class="mt-4 text-[11px] text-slate-400 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block"></span> Selected Date
              <span class="w-2.5 h-2.5 rounded-full border border-cyan-400 inline-block ml-3"></span> Today
            </p>
          </div>

          <!-- Right: Time Slots Grid -->
          <div class="lg:col-span-6 space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-display font-bold text-white text-base">Available 1-Hour Slots</h4>
                <p class="text-xs text-slate-400">Date: <span class="text-pink-400 font-bold">${selectedDate}</span> for ${room.name}</p>
              </div>
              <div class="text-right">
                <span class="text-xs text-slate-400">Hourly Rate:</span>
                <span class="text-sm font-black text-cyan-400 ml-1">$${room.pricePerHour}/hr</span>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              ${this.timeSlotList.map(slot => {
                const isBooked = window.StorageManager.isSlotBooked(room.id, selectedDate, slot.time);
                const isSelected = this.state.selectedSlots.includes(slot.time);

                return `
                  <button type="button"
                          class="slot-btn ${isBooked ? 'slot-booked' : ''} ${isSelected ? 'slot-selected' : ''}"
                          onclick="window.voxBooking.toggleSlot('${slot.time}')"
                          ${isBooked ? 'disabled' : ''}>
                    <div>${slot.label}</div>
                    ${slot.peak ? `<span class="text-[9px] uppercase tracking-wider text-pink-400 font-bold block">Peak Surcharge +$10</span>` : `<span class="text-[9px] text-slate-400 block">Regular</span>`}
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Consecutive Slot Helper Note -->
            <div class="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-slate-300 space-y-1">
              <div class="flex items-center gap-2 text-cyan-300 font-bold">
                <i class="bi bi-info-circle-fill"></i> Multi-Hour Consecutive Selection
              </div>
              <p>You can book consecutive hours (e.g. 8:00 PM + 9:00 PM + 10:00 PM). Non-consecutive slots cannot be selected in a single reservation.</p>
              <p class="text-pink-400 font-bold pt-1">
                Selected: ${this.state.selectedSlots.length} Hour(s) (${this.state.selectedSlots.join(', ') || 'None'})
              </p>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  generateCalendarDays() {
    const year = this.currentCalYear;
    const month = this.currentCalMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = '';

    // Empty lead cells
    for (let i = 0; i < firstDay; i++) {
      html += `<div class="aspect-square"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      cellDate.setHours(0, 0, 0, 0);

      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = cellDate < today;
      const isToday = cellDate.getTime() === today.getTime();
      const isSelected = this.state.selectedDate === dateStr;

      let cls = 'cal-day-cell';
      if (isPast) cls += ' cal-disabled';
      if (isToday) cls += ' cal-today';
      if (isSelected) cls += ' cal-selected';

      html += `
        <button type="button" class="${cls}"
                onclick="window.voxBooking.selectDate('${dateStr}')"
                ${isPast ? 'disabled' : ''}>
          <span>${day}</span>
        </button>
      `;
    }

    return html;
  }

  // -------------------------------------------------------------
  // STEP 3: GUESTS & OCCASION
  // -------------------------------------------------------------
  renderStep3Guests() {
    const room = this.state.selectedRoom;

    return `
      <div class="space-y-6 max-w-2xl mx-auto">
        <div>
          <h3 class="font-display font-black text-2xl text-white">Party Size & Occasion</h3>
          <p class="text-sm text-slate-400">Tailor lighting presets, mic allocation, and seating arrangements.</p>
        </div>

        <div class="space-y-5">
          <!-- Guest Counter -->
          <div class="glass-panel p-5 rounded-2xl border border-purple-800/40 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <label class="font-display font-bold text-white text-base block">Number of Guests</label>
                <span class="text-xs text-slate-400">Room Capacity: ${room.capacityMin} to ${room.capacityMax} Guests</span>
              </div>
              <div class="counter-pill-box flex items-center gap-3 bg-[#0f0a24] p-1.5 rounded-2xl border border-purple-800/50">
                <button type="button" onclick="window.voxBooking.changeGuests(-1)" class="counter-step-btn w-9 h-9 rounded-xl bg-purple-900/60 hover:bg-pink-600 text-white flex items-center justify-center font-bold text-lg transition">
                  <i class="bi bi-dash"></i>
                </button>
                <span class="counter-step-val font-display font-black text-xl text-white w-8 text-center" id="guestsCountDisplay">${this.state.guestsCount}</span>
                <button type="button" onclick="window.voxBooking.changeGuests(1)" class="counter-step-btn w-9 h-9 rounded-xl bg-purple-900/60 hover:bg-cyan-500 hover:text-black text-white flex items-center justify-center font-bold text-lg transition">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>
            ${this.state.guestsCount > room.capacityMax ? `
              <p class="text-xs text-amber-400 font-semibold"><i class="bi bi-exclamation-triangle"></i> Exceeds recommended room capacity of ${room.capacityMax}. Consider upgrading room.</p>
            ` : ''}
          </div>

          <!-- Occasion Selector -->
          <div class="glass-panel p-5 rounded-2xl border border-purple-800/40 space-y-2">
            <label class="font-display font-bold text-white text-base block">What are you celebrating?</label>
            <select id="bookingOccasionSelect" onchange="window.voxBooking.updateOccasion(this.value)"
                    class="w-full px-4 py-3 rounded-xl bg-purple-950/70 border border-purple-800/70 text-white font-medium text-sm focus:outline-none focus:border-pink-500">
              <option value="Birthday Bash" ${this.state.occasion === 'Birthday Bash' ? 'selected' : ''}>🎂 Birthday Bash</option>
              <option value="Friends Hangout" ${this.state.occasion === 'Friends Hangout' ? 'selected' : ''}>🎤 Friends Karaoke Night</option>
              <option value="Bachelor / Bachelorette" ${this.state.occasion === 'Bachelor / Bachelorette' ? 'selected' : ''}>💍 Bachelor / Bachelorette Party</option>
              <option value="Corporate Team Outing" ${this.state.occasion === 'Corporate Team Outing' ? 'selected' : ''}>💼 Corporate Team Outing / Mixer</option>
              <option value="Romantic Date Night" ${this.state.occasion === 'Romantic Date Night' ? 'selected' : ''}>🍷 Romantic Date Night</option>
              <option value="Anniversary" ${this.state.occasion === 'Anniversary' ? 'selected' : ''}>✨ Anniversary Celebration</option>
              <option value="Other Celebration" ${this.state.occasion === 'Other Celebration' ? 'selected' : ''}>🎉 Other Celebration</option>
            </select>
          </div>

          <!-- Special Requests -->
          <div class="glass-panel p-5 rounded-2xl border border-purple-800/40 space-y-2">
            <label class="font-display font-bold text-white text-base block">Special Requests or Notes (Optional)</label>
            <textarea id="bookingNotesInput" rows="3" onchange="window.voxBooking.updateNotes(this.value)" placeholder="e.g. Please pre-chill champagne bucket, dietary allergies, favorite songs to play as walk-in track..."
                      class="w-full px-4 py-3 rounded-xl bg-purple-950/70 border border-purple-800/70 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500">${this.state.specialRequests}</textarea>
          </div>

        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // STEP 4: ADD-ONS & PACKAGES
  // -------------------------------------------------------------
  renderStep4Addons() {
    const addons = window.VOX_ADDONS || [];

    return `
      <div class="space-y-6">
        <div>
          <h3 class="font-display font-black text-2xl text-white">Food, Drinks & Party Add-ons</h3>
          <p class="text-sm text-slate-400">Elevate your singing experience with catered bites, cocktail buckets and party hosts.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${addons.map(addon => {
            const qty = this.state.addons[addon.id] || 0;
            return `
              <div class="glass-panel p-4 rounded-2xl border ${qty > 0 ? 'border-pink-500 shadow-[0_0_15px_rgba(255,0,127,0.3)] bg-purple-950/40' : 'border-purple-800/40'} flex flex-col justify-between">
                <div>
                  <div class="relative h-32 rounded-xl overflow-hidden mb-3">
                    <img src="${addon.image}" alt="${addon.name}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'">
                    <span class="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0b0914]/80 text-cyan-300 border border-cyan-400/30">
                      ${addon.category}
                    </span>
                  </div>

                  <div class="flex items-center justify-between mb-1">
                    <h4 class="font-display font-bold text-white text-sm">${addon.name}</h4>
                    <span class="font-black text-pink-400 text-sm">$${addon.price}</span>
                  </div>
                  <p class="text-[11px] text-slate-400 line-clamp-2 mb-3">${addon.description}</p>
                </div>

                <div class="pt-3 border-t border-purple-800/30 flex items-center justify-between">
                  <span class="text-[11px] text-slate-500">${addon.unit}</span>
                  <div class="flex items-center gap-2">
                    <button type="button" onclick="window.voxBooking.changeAddonQty('${addon.id}', -1)"
                            class="counter-step-btn w-7 h-7 rounded-lg bg-purple-900/60 hover:bg-rose-600 text-white flex items-center justify-center font-bold text-sm transition">
                      <i class="bi bi-dash"></i>
                    </button>
                    <span class="counter-step-val w-6 text-center font-bold text-sm text-white">${qty}</span>
                    <button type="button" onclick="window.voxBooking.changeAddonQty('${addon.id}', 1)"
                            class="counter-step-btn w-7 h-7 rounded-lg bg-purple-900/60 hover:bg-cyan-500 hover:text-black text-white flex items-center justify-center font-bold text-sm transition">
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // STEP 5: REVIEW & CONFIRM
  // -------------------------------------------------------------
  renderStep5Review() {
    const room = this.state.selectedRoom;
    const hours = this.state.selectedSlots.length;
    const roomTotal = room.pricePerHour * hours;

    // Peak surcharge
    const peakSlotsCount = this.state.selectedSlots.filter(t => {
      const s = this.timeSlotList.find(x => x.time === t);
      return s && s.peak;
    }).length;
    const peakSurcharge = peakSlotsCount * 10;

    // Addons subtotal
    let addonsTotal = 0;
    const addonsList = [];
    if (window.VOX_ADDONS) {
      Object.entries(this.state.addons).forEach(([id, qty]) => {
        if (qty > 0) {
          const item = window.VOX_ADDONS.find(a => a.id === id);
          if (item) {
            addonsTotal += item.price * qty;
            addonsList.push({ ...item, qty });
          }
        }
      });
    }

    const subtotal = roomTotal + peakSurcharge + addonsTotal;
    const discount = (subtotal * this.state.discountPercent) / 100;
    const taxableAmount = Math.max(0, subtotal - discount);
    const taxes = taxableAmount * 0.08; // 8% venue tax
    const grandTotal = taxableAmount + taxes;
    const deposit = grandTotal * 0.20; // 20% deposit required
    const balanceDue = grandTotal - deposit;

    const currentUser = window.StorageManager.getCurrentUser();

    return `
      <div class="space-y-6">
        <div>
          <h3 class="font-display font-black text-2xl text-white">Review Reservation & Live Quote</h3>
          <p class="text-sm text-slate-400">Double check your booking details before locking in your stage.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left: Booking Summary Cards -->
          <div class="lg:col-span-7 space-y-4">
            
            <div class="glass-panel p-5 rounded-2xl border border-purple-800/40 flex items-center gap-4">
              <img src="${room.image}" alt="${room.name}" class="w-20 h-20 rounded-xl object-cover ring-2 ring-pink-500/50">
              <div class="space-y-1">
                <span class="text-xs font-bold text-cyan-400 uppercase tracking-wider">${room.theme}</span>
                <h4 class="font-display font-black text-white text-lg">${room.name}</h4>
                <p class="text-xs text-slate-300">
                  <i class="bi bi-people-fill text-pink-400 mr-1"></i> ${this.state.guestsCount} Guests (${this.state.occasion})
                </p>
              </div>
            </div>

            <div class="glass-panel p-5 rounded-2xl border border-purple-800/40 space-y-3">
              <h5 class="font-display font-bold text-white text-sm uppercase tracking-wider">Date & Time Slot</h5>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div class="p-3 rounded-xl bg-purple-950/40 border border-purple-800/30">
                  <span class="text-xs text-slate-400 block">Date</span>
                  <span class="font-bold text-white">${this.state.selectedDate}</span>
                </div>
                <div class="p-3 rounded-xl bg-purple-950/40 border border-purple-800/30">
                  <span class="text-xs text-slate-400 block">Time (${hours} Hours)</span>
                  <span class="font-bold text-pink-400">${this.state.selectedSlots[0]} – ${this.state.selectedSlots[hours - 1]}</span>
                </div>
              </div>
            </div>

            <!-- Add-ons Selected -->
            <div class="glass-panel p-5 rounded-2xl border border-purple-800/40 space-y-3">
              <h5 class="font-display font-bold text-white text-sm uppercase tracking-wider">Selected Extras</h5>
              ${addonsList.length > 0 ? `
                <div class="space-y-2">
                  ${addonsList.map(a => `
                    <div class="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-purple-900/30">
                      <span>${a.qty}x ${a.name}</span>
                      <span class="font-bold text-white">$${a.price * a.qty}</span>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <p class="text-xs text-slate-400">No add-ons selected. You can also order directly inside the room from our iPad.</p>
              `}
            </div>

            <!-- Demo Authentication status indicator -->
            ${!currentUser ? `
              <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                  <i class="bi bi-shield-exclamation text-base"></i>
                  <span>You're booking as guest. Clicking Confirm will prompt instant login with demo credentials pre-filled so you won't lose your booking!</span>
                </div>
                <a href="login.html" class="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold whitespace-nowrap">Sign In</a>
              </div>
            ` : ''}

          </div>

          <!-- Right: Live Cost Calculation & Promo -->
          <div class="lg:col-span-5 glass-panel p-6 rounded-2xl border border-pink-500/40 space-y-5">
            <h4 class="font-display font-bold text-white text-base">Payment Summary</h4>

            <!-- Promo Input -->
            <div class="space-y-1">
              <label class="text-xs text-slate-400 font-semibold">Have a Promo Code?</label>
              <div class="flex gap-2">
                <input type="text" id="promoCodeInput" placeholder="Try PARTY10 or NEON20" value="${this.state.promoCode}"
                       class="flex-1 px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-800/60 text-white text-xs uppercase font-bold focus:outline-none focus:border-pink-500">
                <button type="button" onclick="window.voxBooking.applyPromo()" class="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-pink-600 text-white text-xs font-bold transition">
                  Apply
                </button>
              </div>
              ${this.state.discountPercent > 0 ? `
                <p class="text-[11px] text-emerald-400 font-semibold"><i class="bi bi-check-circle-fill"></i> Promo code applied (${this.state.discountPercent}% off!)</p>
              ` : ''}
            </div>

            <!-- Price Breakdown -->
            <div class="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-purple-800/40">
              <div class="flex justify-between">
                <span>Room Hire (${hours} hrs @ $${room.pricePerHour}/hr)</span>
                <span class="font-bold text-white">$${roomTotal.toFixed(2)}</span>
              </div>
              ${peakSurcharge > 0 ? `
                <div class="flex justify-between text-pink-300">
                  <span>Peak Hours Lighting Surcharge (${peakSlotsCount} hrs)</span>
                  <span class="font-bold">+$${peakSurcharge.toFixed(2)}</span>
                </div>
              ` : ''}
              ${addonsTotal > 0 ? `
                <div class="flex justify-between">
                  <span>Party Add-ons & Catering</span>
                  <span class="font-bold text-white">$${addonsTotal.toFixed(2)}</span>
                </div>
              ` : ''}
              ${discount > 0 ? `
                <div class="flex justify-between text-emerald-400">
                  <span>Discount (${this.state.discountPercent}%)</span>
                  <span class="font-bold">-$${discount.toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="flex justify-between text-slate-400">
                <span>Venue Service & Tech Taxes (8%)</span>
                <span>$${taxes.toFixed(2)}</span>
              </div>

              <!-- Grand Total -->
              <div class="pt-3 border-t border-purple-800/40 flex justify-between items-baseline">
                <span class="font-display font-bold text-white text-sm">Estimated Total</span>
                <span class="font-display font-black text-2xl text-cyan-400">$${grandTotal.toFixed(2)}</span>
              </div>

              <div class="p-3 rounded-xl bg-[#0e0924] border border-cyan-500/30 space-y-1">
                <div class="flex justify-between font-bold text-white">
                  <span>Lock-in Deposit (20%):</span>
                  <span class="text-pink-400">$${deposit.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-[11px] text-slate-400">
                  <span>Due upon room arrival:</span>
                  <span>$${balanceDue.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // CONTROLLER ACTIONS & STEP NAVIGATION
  // -------------------------------------------------------------
  goToStep(step) {
    if (step < 1 || step > this.totalSteps) return;

    // Validation when moving forward
    if (step > 1 && !this.state.selectedRoom) {
      if (window.Toast) window.Toast.error('Please select a themed room first.');
      return;
    }
    if (step > 2 && (!this.state.selectedDate || this.state.selectedSlots.length === 0)) {
      if (window.Toast) window.Toast.error('Please select a date and at least one time slot.');
      return;
    }

    this.currentStep = step;
    this.render();
    window.scrollTo({ top: this.container.offsetTop - 100, behavior: 'smooth' });
  }

  selectRoom(roomId, andAdvance = false) {
    // If clicking an already selected room without explicit advance, toggle it off (deselect)
    if (this.state.selectedRoom && this.state.selectedRoom.id === roomId && !andAdvance) {
      this.deselectRoom(roomId);
      return;
    }

    const room = (window.VOX_ROOMS || []).find(r => r.id === roomId);
    if (room) {
      this.state.selectedRoom = room;
      if (this.state.guestsCount < room.capacityMin) this.state.guestsCount = room.capacityMin;
      if (this.state.guestsCount > room.capacityMax) this.state.guestsCount = room.capacityMax;
      if (window.Toast) window.Toast.neon(`Selected ${room.name}!`);
      if (andAdvance) {
        this.goToStep(2);
      } else {
        this.render();
      }
    }
  }

  deselectRoom(roomId = null) {
    const roomName = this.state.selectedRoom ? this.state.selectedRoom.name : 'Room';
    this.state.selectedRoom = null;
    if (window.Toast) window.Toast.info(`${roomName} deselected. Please select a room to continue.`);
    this.render();
  }

  toggleRoom(roomId) {
    if (this.state.selectedRoom && this.state.selectedRoom.id === roomId) {
      this.deselectRoom(roomId);
    } else {
      this.selectRoom(roomId, false);
    }
  }

  selectDate(dateStr) {
    this.state.selectedDate = dateStr;
    // Clear slots that might be booked on this new date
    this.state.selectedSlots = [];
    this.render();
  }

  changeMonth(delta) {
    this.currentCalMonth += delta;
    if (this.currentCalMonth > 11) {
      this.currentCalMonth = 0;
      this.currentCalYear++;
    } else if (this.currentCalMonth < 0) {
      this.currentCalMonth = 11;
      this.currentCalYear--;
    }
    this.render();
  }

  toggleSlot(time) {
    const idx = this.state.selectedSlots.indexOf(time);
    if (idx !== -1) {
      this.state.selectedSlots.splice(idx, 1);
    } else {
      // Enforce consecutive slots validation
      if (this.state.selectedSlots.length > 0) {
        const sorted = [...this.state.selectedSlots, time].sort();
        // Check if consecutive
        const timeIndices = sorted.map(t => this.timeSlotList.findIndex(s => s.time === t));
        let consecutive = true;
        for (let i = 1; i < timeIndices.length; i++) {
          if (timeIndices[i] !== timeIndices[i - 1] + 1) {
            consecutive = false;
            break;
          }
        }
        if (!consecutive) {
          if (window.Toast) window.Toast.warning('Slots must be consecutive hours (e.g. 8 PM + 9 PM). Starting a new selection.');
          this.state.selectedSlots = [time];
          this.render();
          return;
        }
      }
      this.state.selectedSlots.push(time);
      this.state.selectedSlots.sort();
    }
    this.render();
  }

  changeGuests(delta) {
    const room = this.state.selectedRoom;
    let next = this.state.guestsCount + delta;
    if (next < 1) next = 1;
    this.state.guestsCount = next;
    const display = document.getElementById('guestsCountDisplay');
    if (display) display.textContent = next;
    this.render();
  }

  updateOccasion(val) {
    this.state.occasion = val;
  }

  updateNotes(val) {
    this.state.specialRequests = val;
  }

  changeAddonQty(addonId, delta) {
    const cur = this.state.addons[addonId] || 0;
    const next = Math.max(0, cur + delta);
    this.state.addons[addonId] = next;
    this.render();
  }

  applyPromo() {
    const input = document.getElementById('promoCodeInput');
    const code = (input ? input.value : this.state.promoCode).trim().toUpperCase();

    if (code === 'PARTY10') {
      this.state.promoCode = code;
      this.state.discountPercent = 10;
      if (window.Toast) window.Toast.success('PARTY10 Applied: 10% Discount unlocked!');
    } else if (code === 'NEON20' || code === 'VOXVIP15') {
      this.state.promoCode = code;
      this.state.discountPercent = code === 'NEON20' ? 20 : 15;
      if (window.Toast) window.Toast.success(`${code} Applied: ${this.state.discountPercent}% Discount!`);
    } else {
      if (window.Toast) window.Toast.error('Invalid code. Try PARTY10 or NEON20');
      this.state.discountPercent = 0;
    }
    this.render();
  }

  confirmBooking() {
    // If not logged in, prompt login or auto-login with demo
    let user = window.StorageManager.getCurrentUser();
    if (!user) {
      // Save draft and notify
      window.StorageManager.setDraftBooking(this.state);
      if (window.Toast) window.Toast.info('Logging you into demo session to complete booking...');
      
      const loginRes = window.StorageManager.login('demo@partyroom.com', 'Demo@123');
      if (loginRes.success) {
        user = loginRes.user;
      }
    }

    const room = this.state.selectedRoom;
    const hours = this.state.selectedSlots.length;
    const roomTotal = room.pricePerHour * hours;

    const addonsList = [];
    let addonsTotal = 0;
    if (window.VOX_ADDONS) {
      Object.entries(this.state.addons).forEach(([id, qty]) => {
        if (qty > 0) {
          const item = window.VOX_ADDONS.find(a => a.id === id);
          if (item) {
            addonsTotal += item.price * qty;
            addonsList.push({ id, name: item.name, price: item.price, qty });
          }
        }
      });
    }

    const subtotal = roomTotal + addonsTotal;
    const discount = (subtotal * this.state.discountPercent) / 100;
    const grandTotal = Math.max(0, subtotal - discount) * 1.08;
    const deposit = grandTotal * 0.20;

    const bookingPayload = {
      roomId: room.id,
      roomName: room.name,
      roomTheme: room.theme,
      capacityTier: room.capacityTier,
      date: this.state.selectedDate,
      timeSlots: this.state.selectedSlots,
      timeText: `${this.state.selectedSlots[0]} – ${this.state.selectedSlots[hours - 1]} (${hours} Hrs)`,
      guests: this.state.guestsCount,
      occasion: this.state.occasion,
      specialRequests: this.state.specialRequests,
      addOns: addonsList,
      hourlyRate: room.pricePerHour,
      hoursCount: hours,
      roomSubtotal: roomTotal,
      addonsSubtotal: addonsTotal,
      taxes: grandTotal * 0.08 / 1.08,
      discount: discount,
      promoCode: this.state.promoCode,
      totalAmount: grandTotal,
      depositPaid: deposit,
      balanceDue: grandTotal - deposit,
      status: 'Confirmed'
    };

    const newBooking = window.StorageManager.createReservation(bookingPayload);
    window.StorageManager.clearDraftBooking();

    // Show Confirmation Modal
    this.showConfirmationModal(newBooking);
  }

  showConfirmationModal(booking) {
    const modalId = 'bookingSuccessModal';
    let modal = document.getElementById(modalId);
    if (!modal) {
      modal = document.createElement('div');
      modal.id = modalId;
      document.body.appendChild(modal);
    }

    modal.className = 'fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl';
    modal.innerHTML = `
      <div class="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-pink-500/50 shadow-[0_0_50px_rgba(255,0,127,0.4)] text-center space-y-5 animate-pulse-glow">
        
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-cyan-400 mx-auto flex items-center justify-center shadow-lg">
          <i class="bi bi-check-lg text-3xl text-white"></i>
        </div>

        <div>
          <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest">Stage Confirmed!</span>
          <h3 class="font-display font-black text-2xl text-white mt-1">Get Ready to Sing!</h3>
          <p class="text-xs text-slate-300 mt-1">Booking Reference: <span class="text-pink-400 font-mono font-bold">${booking.id}</span></p>
        </div>

        <div class="p-4 rounded-2xl bg-purple-950/60 border border-purple-800/40 text-left text-xs space-y-2">
          <div class="flex justify-between"><span class="text-slate-400">Venue:</span> <span class="font-bold text-white">${booking.roomName}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Date:</span> <span class="font-bold text-white">${booking.date}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Slot:</span> <span class="font-bold text-pink-400">${booking.timeText}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Guests:</span> <span class="font-bold text-white">${booking.guests} Guests</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Deposit Paid:</span> <span class="font-bold text-emerald-400">$${booking.depositPaid.toFixed(2)}</span></div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 pt-2">
          <button type="button" onclick="window.voxBooking.downloadICS('${booking.id}')"
                  class="btn-neon-outline flex-1 py-3 text-xs">
            <i class="bi bi-calendar-event"></i> Add to Calendar (.ics)
          </button>
          <a href="dashboard.html#reservations" class="btn-neon-primary flex-1 py-3 text-xs text-center">
            <i class="bi bi-speedometer2"></i> View in Dashboard
          </a>
        </div>

        <button type="button" onclick="document.getElementById('${modalId}').remove()" class="text-xs text-slate-400 hover:text-white">
          Close Window
        </button>
      </div>
    `;

    if (window.Toast) {
      window.Toast.success(`Reservation ${booking.id} locked in!`, 'Booking Confirmed! 🎤');
    }
  }

  downloadICS(bookingId) {
    const booking = window.StorageManager.getReservationById(bookingId);
    if (!booking) return;

    const dateStr = booking.date.replace(/-/g, '');
    const startTime = (booking.timeSlots[0] || '20:00').replace(':', '') + '00';
    const endTime = (booking.timeSlots[booking.timeSlots.length - 1] || '22:00').replace(':', '') + '00';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VibeVault Karaoke//Booking Confirmation//EN',
      'BEGIN:VEVENT',
      `UID:${booking.id}@vibevault.com`,
      `DTSTAMP:${dateStr}T${startTime}Z`,
      `DTSTART:${dateStr}T${startTime}00`,
      `DTEND:${dateStr}T${endTime}00`,
      `SUMMARY:VibeVault Karaoke - ${booking.roomName}`,
      `DESCRIPTION:Booking ID ${booking.id}. Private Party for ${booking.guests} guests. Balance due at arrival: $${booking.balanceDue.toFixed(2)}.`,
      'LOCATION:VibeVault Flagship - 428 Neon Strip Ave',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${booking.id}-calendar.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.Toast) {
      window.Toast.info('Downloaded .ics calendar file!');
    }
  }

  bindEvents() {
    const prevBtn = document.getElementById('stepperPrevBtn');
    const nextBtn = document.getElementById('stepperNextBtn');
    const confirmBtn = document.getElementById('stepperConfirmBtn');

    if (prevBtn) prevBtn.addEventListener('click', () => this.goToStep(this.currentStep - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => this.goToStep(this.currentStep + 1));
    if (confirmBtn) confirmBtn.addEventListener('click', () => this.confirmBooking());

    // Tier pills
    const pills = this.container.querySelectorAll('.room-tier-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        pills.forEach(p => {
          p.classList.remove('bg-pink-600', 'text-white');
          p.classList.add('bg-purple-950/70', 'text-slate-300');
        });
        pill.classList.remove('bg-purple-950/70', 'text-slate-300');
        pill.classList.add('bg-pink-600', 'text-white');

        const tier = pill.getAttribute('data-tier');
        const cards = this.container.querySelectorAll('#stepperRoomsGrid .room-card');
        const rooms = window.VOX_ROOMS || [];
        cards.forEach((card, index) => {
          const room = rooms[index];
          if (!room) return;
          if (tier === 'all' || room.capacityTier === tier) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
}

// Global attach
if (typeof window !== 'undefined') {
  window.VoxBookingStepper = VoxBookingStepper;
  window.VibeBookingStepper = VoxBookingStepper;
}
