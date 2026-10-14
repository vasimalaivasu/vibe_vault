# VibeVault - Karaoke & Private Party Room Rental HTML Template

> **ThemeForest & Commercial Production Ready HTML5 / Tailwind Template**  
> Vibrant Nightlife Neon Aesthetic • Real-time Customer Dashboard • 5-Step Slot Booking Wizard • Live Reservation Status Progression

---

## 🌟 Overview

**VibeVault** is an HTML5 template tailored specifically for Karaoke Lounges, Private Party Suites, VIP Nightclubs, and Multi-Branch Entertainment Venues.

- **Theme Palette:** Deep Midnight Indigo (`#0B0914`), Electric Magenta (`#FF007F`), Neon Cyan (`#00F0FF`), Sunset Orange (`#FF5E3A`).
- **Dark & Light Mode:** Default light mode with vibrant dark nightlife glow toggle.
- **RTL Ready:** Layout support with `dir="rtl"` logical properties.
- **Pure Frontend:** Zero backend/framework dependencies. Powered by HTML5, Tailwind CSS, Vanilla JS (ES6), and LocalStorage.

---

## 🚀 Live Demo Credentials

The template comes pre-seeded with sample reservations, loyalty points, and a demo vocalist account:

| Field | Value |
|---|---|
| **Demo User** | Alex Vance (Gold VIP Member) |
| **Email** | `demo@partyroom.com` |
| **Password** | `Demo@123` |
| **One-Click Auto-Fill** | Available directly on [`login.html`](file:///c:/Users/Vasimalai/Desktop/Karoke%20&%20Room/login.html) |

---

## 📂 Project Structure

```
vibevault/
├── index.html              # Landing Page (Hero, Equalizer, Quick Availability, 12 Rooms, FAQ)
├── rooms.html              # Rooms Listing organized by capacity tiers with Modal Specs
├── packages.html           # Party Packages & Pricing with Weekday/Weekend toggle & Add-ons
├── login.html              # Split Auth Portal (Login, Register, Forgot Password, Auto-Fill)
├── dashboard.html          # Full Customer Dashboard (8 Tabs, Live Status Tracking, Invoices)
├── contact.html            # 3 Branch Locations, Validated Inquiry Form, GPS Map
├── terms.html              # House Rules, 24h Cancellation Guarantee, Privacy Policy
├── 404.html                # Neon Music-Themed 404 Page
├── server.js               # Zero-dependency local static HTTP server (Port 8080)
├── assets/
│   ├── css/
│   │   └── main.css        # CSS variables, glassmorphism, equalizer, animations, RTL
│   └── js/
│       ├── data/
│       │   ├── images.js   # Centralized 4K photography configuration
│       │   ├── rooms-data.js # 12 Themed Karaoke Room specifications
│       │   └── packages-data.js # Pricing tiers, add-ons, comparison matrix
│       ├── storage.js      # Unified LocalStorage manager & demo data seeder
│       ├── toast.js        # Neon toast notification system
│       ├── navbar.js       # Responsive sticky navbar with RTL & theme toggle
│       ├── footer.js       # Unified footer with newsletter validation
│       ├── booking-stepper.js # 5-step booking wizard & .ics calendar generator
│       ├── dashboard.js    # Dashboard controller, live status advance, printable invoice
│       └── main.js         # Availability widget, counters, lightbox, accordions
└── docs/
    └── index.html          # ThemeForest Documentation & Customization Guide
```

---

## 🎤 Key Features & Interactions

1. **5-Step Booking Engine (`booking-stepper.js`):**
   - **Step 1:** Themed Room selection with capacity filtering.
   - **Step 2:** Interactive Vanilla JS Calendar + 1-hour slot grid (12:00 PM – 2:00 AM) with peak hour surcharges and consecutive slot selection validation.
   - **Step 3:** Party size validation (against min/max room limits) + Occasion selector.
   - **Step 4:** Card-based food & drink add-ons with quantity steppers (`+` / `-`).
   - **Step 5:** Live price breakdown + Promo code system (`PARTY10` for 10% off, `NEON20` for 20% off) + 20% deposit calculation.
   - **Confirmation:** Generates Booking ID (e.g., `KP-2026-00130`), instant `.ics` calendar file download, saves to LocalStorage, and redirects to Dashboard.

2. **Customer Dashboard (`dashboard.html`):**
   - **Overview:** Real-time countdown timer to upcoming party, dynamic metric counters, and recent bookings.
   - **My Reservations:** Status tabs (All, Upcoming, In Progress, Completed, Cancelled) + Live animated progression timeline (`Pending → Confirmed → Checked In → In Session → Completed`).
   - **Demo Advance Status Helper:** Clearly labeled button allowing reviewers to advance any reservation through each stage in real time!
   - **Printable Invoices:** Clean printable invoice HTML pop-up with room hire hours, add-ons breakdown, deposit paid, and balance due.
   - **Add-ons Manager:** Attach food/drink extras directly to any upcoming reservation with automatic recalculation.
   - **Profile & Base64 Avatar Upload:** Edit name/phone/email with instant photo preview stored as Base64 in LocalStorage.
   - **Settings:** Dark/Light theme toggle, LTR/RTL layout toggle, notification preferences, and a "Reset Demo Data" option.

3. **Centralized Photographic Assets (`assets/js/data/images.js`):**
   - All high-resolution 4K Unsplash photos are configured in one central file for easy asset swapping.

---

## 💻 Running Locally

Simply run:
```bash
node server.js
```
Open your browser at:
`http://localhost:8080`

Or double-click any `.html` file directly in your browser.
