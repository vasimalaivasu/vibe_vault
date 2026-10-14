/**
 * VibeVault - Packages, Add-ons & Pricing Data
 */

const VOX_PACKAGES = [
  {
    id: 'pkg-jam-session',
    name: 'Jam Session',
    badge: 'Starter Choice',
    tagline: 'Perfect for quick rehearsals, casual duos & spontaneous after-work singing.',
    weekdayPrice: 79,
    weekendPrice: 99,
    durationHours: 2,
    capacityTier: 'Mini (2–4 Guests)',
    popular: false,
    image: VOX_IMAGES.packages.jamSession,
    includedFeatures: [
      '2 Full Hours in a Mini Themed Room',
      '2 Wireless Studio Microphones',
      'Unlimited 120,000+ Track Song Catalog',
      'Complimentary Soft Drink Pitcher',
      'Touchscreen iPad Song Queue System'
    ],
    notIncluded: [
      'Hot Food Platter',
      'Champagne or Alcohol Bucket',
      'Custom Party Balloon Set',
      'Dedicated Room Host'
    ]
  },
  {
    id: 'pkg-party-starter',
    name: 'Party Starter',
    badge: 'Popular Group',
    tagline: 'Our go-to package for energetic friend squads and weekend celebrations.',
    weekdayPrice: 159,
    weekendPrice: 199,
    durationHours: 3,
    capacityTier: 'Standard (5–8 Guests)',
    popular: false,
    image: VOX_IMAGES.packages.partyStarter,
    includedFeatures: [
      '3 Full Hours in a Standard Themed Room',
      '4 Wireless Vocal Microphones',
      '1 Loaded Finger Food / Snack Platter',
      '1 Non-Alcoholic Beverage Pitcher or Beer Bucket',
      'Synchronized Disco & Laser Lighting',
      'Free Digital Party Photo Keepsake'
    ],
    notIncluded: [
      'Custom Birthday Cake',
      'Dedicated Room Host',
      'Private Bartender Service'
    ]
  },
  {
    id: 'pkg-birthday-bash',
    name: 'Birthday Bash',
    badge: 'Most Popular ⭐',
    tagline: 'Complete VIP birthday experience with cake, decorations and endless hype.',
    weekdayPrice: 289,
    weekendPrice: 349,
    durationHours: 3,
    capacityTier: 'Party (9–15 Guests)',
    popular: true,
    image: VOX_IMAGES.packages.birthdayBash,
    includedFeatures: [
      '3 Full Hours in a Party Themed Room',
      'Customized Birthday Cake (Chocolate or Berry)',
      'Neon Balloon Arch & Birthday Garland Decor',
      '2 Gourmet Snack & Finger Food Platters',
      '2 Beverage Buckets (Wine/Beer or Mocktails)',
      'Digital Selfie Photo Booth Access',
      'VIP Priority Song Request Queue'
    ],
    notIncluded: [
      'Professional MC / Host'
    ]
  },
  {
    id: 'pkg-corporate-mixer',
    name: 'Corporate Mixer',
    badge: 'Team Outing',
    tagline: 'High-energy team bonding with buffet catering, icebreakers and stage sound.',
    weekdayPrice: 489,
    weekendPrice: 579,
    durationHours: 4,
    capacityTier: 'VIP or Grand Hall (16–30 Guests)',
    popular: false,
    image: VOX_IMAGES.packages.corporateMixer,
    includedFeatures: [
      '4 Full Hours in VIP Lounge or Grand Hall',
      'Hot Buffet & Hors d\'oeuvres Catering',
      'Full Beverage Bar Package with Bartender',
      '6 to 8 Wireless Shure Microphones',
      '150" Laser Projector for Presentations & Duets',
      'Custom Team Trivia & Singing Tournament Mode',
      'Dedicated VibeVault Event Host'
    ],
    notIncluded: []
  },
  {
    id: 'pkg-vip-platinum',
    name: 'VIP Platinum',
    badge: 'Ultra Luxury',
    tagline: 'Red-carpet private venue experience for bachelor parties and milestone galas.',
    weekdayPrice: 699,
    weekendPrice: 849,
    durationHours: 5,
    capacityTier: 'Royal Penthouse / Grand Hall (Up to 40 Guests)',
    popular: false,
    image: VOX_IMAGES.packages.vipPlatinum,
    includedFeatures: [
      '5 Full Hours in Royal VIP or Future Stage',
      'Personal Dedicated Mixologist & Butler',
      'Gourmet Canapé Service & Premium Dessert Bar',
      'Top-Shelf Champagne Welcome Toast',
      'All 8 Shure Axient Digital Wireless Mics',
      'Dedicated DJ / Sound Tech on live console',
      'Unlimited 4K Video Recording & Highlights Reel',
      'Free Roundtrip VIP Shuttle (Local 10-mile radius)'
    ],
    notIncluded: []
  }
];

const VOX_ADDONS = [
  {
    id: 'addon-snack-platter',
    name: 'Gourmet Snack Platter',
    category: 'Food & Dining',
    price: 35,
    unit: 'per platter (serves 4-6)',
    icon: 'bi-basket2',
    image: VOX_IMAGES.addons.snackPlatter,
    description: 'Crispy Korean fried chicken wings, truffle fries, spring rolls, and artisanal dip trio.'
  },
  {
    id: 'addon-beverage-bucket',
    name: 'Ice Beverage Bucket',
    category: 'Drinks',
    price: 45,
    unit: 'bucket of 6 drinks',
    icon: 'bi-cup-straw',
    image: VOX_IMAGES.addons.beverageBucket,
    description: 'Choice of imported craft beers, hard seltzers, or premium tropical mocktails on crushed ice.'
  },
  {
    id: 'addon-birthday-cake',
    name: 'Signature Celebration Cake',
    category: 'Celebration',
    price: 50,
    unit: 'custom 2-tier cake',
    icon: 'bi-cake2',
    image: VOX_IMAGES.addons.birthdayCake,
    description: 'Handcrafted chocolate fudge or raspberry matcha cake with sparkler candles and custom lettering.'
  },
  {
    id: 'addon-balloon-decor',
    name: 'Neon Balloon & Garland Set',
    category: 'Celebration',
    price: 40,
    unit: 'full room setup',
    icon: 'bi-balloon',
    image: VOX_IMAGES.addons.balloonsDecor,
    description: 'Vibrant metallic balloons, custom LED neon name sign, and shimmering photo garland backdrop.'
  },
  {
    id: 'addon-photo-booth',
    name: 'Digital GIF Photo Booth',
    category: 'Entertainment',
    price: 65,
    unit: 'unlimited session',
    icon: 'bi-camera2',
    image: VOX_IMAGES.addons.photoBooth,
    description: 'Interactive touchscreen ring-light booth with fun physical props, instant phone AirDrop & QR sharing.'
  },
  {
    id: 'addon-mc-host',
    name: 'Professional Party MC / Host',
    category: 'Entertainment',
    price: 80,
    unit: '2-hour host',
    icon: 'bi-person-raised-hand',
    image: VOX_IMAGES.addons.mcHost,
    description: 'Energetic host to organize sing-offs, hype games, blind karaoke challenges, and keep the party electric.'
  },
  {
    id: 'addon-dj-mix',
    name: 'Live DJ Mix Set & Transitions',
    category: 'Entertainment',
    price: 95,
    unit: '2-hour live set',
    icon: 'bi-disc',
    image: VOX_IMAGES.addons.djMix,
    description: 'Resident club DJ providing seamless dance beat drops, mashups, and live remix backing tracks.'
  },
  {
    id: 'addon-extra-hour',
    name: 'Extra Jam Hour',
    category: 'Time Extension',
    price: 40,
    unit: 'per 60 minutes',
    icon: 'bi-hourglass-split',
    image: VOX_IMAGES.addons.extraHour,
    description: 'Add an additional consecutive hour to your singing session at a heavily discounted rate.'
  },
  {
    id: 'addon-pro-mics',
    name: 'Studio Vocal Mic Upgrade',
    category: 'Equipment',
    price: 25,
    unit: 'pair of studio mics',
    icon: 'bi-mic-fill',
    image: VOX_IMAGES.addons.proMics,
    description: 'Upgrade to studio-grade Shure Beta 87A vocal condenser mics with real-time autotune pitch correction.'
  },
  {
    id: 'addon-led-light-show',
    name: 'Advanced Laser & Strobe Package',
    category: 'Visuals',
    price: 30,
    unit: 'session pass',
    icon: 'bi-magic',
    image: VOX_IMAGES.addons.ledLightShow,
    description: 'DMX sync computer-controlled RGB lasers, safe water mist foggers, and beat-reactive pulse strobes.'
  },
  {
    id: 'addon-vip-song-queue',
    name: 'VIP Song Priority Pass',
    category: 'Perks',
    price: 15,
    unit: 'unlimited skips',
    icon: 'bi-lightning-fill',
    image: VOX_IMAGES.addons.vipSongQueue,
    description: 'Jump to top of song queue instantly from any phone without interrupting current singer.'
  },
  {
    id: 'addon-midnight-feast',
    name: 'Midnight Sliders & Loaded Nachos',
    category: 'Food & Dining',
    price: 48,
    unit: 'party combo (serves 6–8)',
    icon: 'bi-fire',
    image: VOX_IMAGES.addons.midnightFeast,
    description: 'Mini Wagyu and crispy chicken sliders, hot skillet nachos with melted queso, guacamole & jalapenos.'
  }
];

const VOX_PACKAGE_COMPARISON = [
  { feature: 'Included Hours', jam: '2 Hours', starter: '3 Hours', bash: '3 Hours', corp: '4 Hours', vip: '5 Hours' },
  { feature: 'Capacity Range', jam: '2–4 Guests', starter: '5–8 Guests', bash: '9–15 Guests', corp: '16–30 Guests', vip: 'Up to 40 Guests' },
  { feature: 'Wireless Microphones', jam: '2 Mics', starter: '4 Mics', bash: '4 Mics', corp: '6–8 Mics', vip: '8 Studio Mics' },
  { feature: 'Complimentary Drinks', jam: '1 Pitcher', starter: '1 Bucket', bash: '2 Buckets', corp: 'Full Open Bar', vip: 'Champagne & Open Bar' },
  { feature: 'Snacks & Food', jam: '—', starter: '1 Platter', bash: '2 Platters', corp: 'Hot Buffet', vip: 'Gourmet Canapés' },
  { feature: 'Custom Cake & Decor', jam: '—', starter: '—', bash: 'Included', corp: 'Optional Add-on', vip: 'Included' },
  { feature: 'Sound & Audio Level', jam: 'Standard Studio', starter: 'Club Sound', bash: 'Bass Boosted', corp: 'Line Array', vip: 'Spatial L-Acoustics' },
  { feature: 'Dedicated Staff', jam: 'Self-Service', starter: 'On-Call', bash: 'Dedicated Runner', corp: 'Event Host', vip: 'Private Butler & DJ' },
  { feature: 'Cancellation Window', jam: '24 Hours', starter: '24 Hours', bash: '48 Hours', corp: '72 Hours', vip: '5 Days' }
];

const VOX_PRICING_FAQS = [
  {
    q: 'Can we bring our own birthday cake or outside snacks?',
    a: 'Outside birthday cakes are welcome with a small $10 cake service fee (which includes plates, napkins, and cutting utensils). For other outside food or drinks, please check our package corkage options or select our catering add-ons.'
  },
  {
    q: 'What is the difference between Weekday and Weekend rates?',
    a: 'Weekday rates apply Monday through Thursday all day. Weekend rates apply Friday 4:00 PM through Sunday midnight, as well as on national holidays.'
  },
  {
    q: 'Is a deposit required when booking online?',
    a: 'Yes, a 20% refundable deposit is charged at checkout to lock in your date and room slot. The remaining balance can be settled upon arrival via card, cash, or digital wallet.'
  },
  {
    q: 'What happens if we want to extend our session on the night?',
    a: 'If your room does not have an immediate reservation after your slot, you can easily extend in 30 or 60-minute increments right from the in-room iPad tablet or at the front reception.'
  },
  {
    q: 'Can minors visit VibeVault?',
    a: 'All ages are warmly welcomed before 8:00 PM! After 8:00 PM, guests under 18 must be accompanied by an adult, and valid ID is checked for alcoholic beverage service.'
  }
];

if (typeof window !== 'undefined') {
  window.VOX_PACKAGES = VOX_PACKAGES;
  window.VOX_ADDONS = VOX_ADDONS;
  window.VOX_PACKAGE_COMPARISON = VOX_PACKAGE_COMPARISON;
  window.VOX_PRICING_FAQS = VOX_PRICING_FAQS;
  window.VIBE_PACKAGES = VOX_PACKAGES;
  window.VIBE_ADDONS = VOX_ADDONS;
}
