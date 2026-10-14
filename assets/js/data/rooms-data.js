/**
 * VibeVault - 12 Themed Karaoke & Party Rooms Data
 */

const VOX_ROOMS = [
  {
    id: 'room-retro-80s',
    name: 'Neon Retro 80s',
    theme: 'Retro Synthwave',
    capacityTier: 'mini',
    capacityText: '2 – 4 Guests',
    capacityMin: 2,
    capacityMax: 4,
    pricePerHour: 45,
    weekendPrice: 55,
    rating: 4.9,
    reviewsCount: 142,
    badge: 'Popular for Duos',
    featured: true,
    image: VOX_IMAGES.rooms.retro80s,
    gallery: [
      VOX_IMAGES.rooms.retro80s,
      VOX_IMAGES.hero.partyLounge,
      VOX_IMAGES.addons.ledLightShow
    ],
    tagline: 'Arcade neon aesthetic with retro synth vibes and vaporwave glow.',
    description: 'Step into a synthwave paradise with custom neon grid walls, vintage arcade accents, and pristine studio monitors. Ideal for close friends, romantic date nights, or duo sing-offs.',
    amenities: [
      { name: 'Dolby Atmos Sound', icon: 'bi-soundwave' },
      { name: '4K 65" Display', icon: 'bi-tv' },
      { name: '2 Wireless Shure Mics', icon: 'bi-mic-fill' },
      { name: 'Neon Mood Lighting', icon: 'bi-lightbulb' },
      { name: 'iPad Song Selector', icon: 'bi-tablet' },
      { name: 'Mini Beverage Fridge', icon: 'bi-cup-straw' }
    ],
    equipment: [
      '2x Shure BLX24/PG58 Wireless Vocal Microphones',
      'JBL EON710 High-Definition Sound System with Powered Subwoofer',
      '65-inch LG OLED 4K Video Monitor with Zero Latency',
      'Touchscreen iPad Pro K-System with 120,000+ Multi-Language Tracks',
      'Programmable RGB Neon Tube Lighting with Audio Sync'
    ],
    houseRules: [
      'Strictly non-smoking room (vaping prohibited inside room)',
      'External food permitted with $10 cleaning deposit',
      'Maximum capacity enforced for safety (up to 4 guests)',
      '15-minute grace period before slot concludes'
    ]
  },
  {
    id: 'room-kpop-studio',
    name: 'K-Pop Idol Studio',
    theme: 'K-Pop & Idol',
    capacityTier: 'standard',
    capacityText: '5 – 8 Guests',
    capacityMin: 5,
    capacityMax: 8,
    pricePerHour: 65,
    weekendPrice: 78,
    rating: 5.0,
    reviewsCount: 210,
    badge: 'Fan Favorite',
    featured: true,
    image: VOX_IMAGES.rooms.kpopStudio,
    gallery: [
      VOX_IMAGES.rooms.kpopStudio,
      VOX_IMAGES.hero.singer,
      VOX_IMAGES.addons.proMics
    ],
    tagline: 'Futuristic pastel stage lighting, dance mirror, and synchronized lightsticks.',
    description: 'Designed like a Seoul recording studio and rehearsal stage. Features full-length dance practice mirrors, synchronized lightstick hooks, crystal vocal processors, and complete Korean, Japanese, and English catalogues.',
    amenities: [
      { name: 'Studio Vocal EQ', icon: 'bi-sliders' },
      { name: '4 Wireless Mics', icon: 'bi-mic-fill' },
      { name: 'Full Dance Mirror', icon: 'bi-aspect-ratio' },
      { name: 'Synchronized Stage Rig', icon: 'bi-sun-fill' },
      { name: 'Touchscreen Catalog', icon: 'bi-tablet' },
      { name: 'Selfie Ring Lights', icon: 'bi-camera' }
    ],
    equipment: [
      '4x Sennheiser EW-D Digital Wireless Microphones',
      'Yamaha DXR12mkII 1100W Powered PA System with Auto-Tune Vocal FX',
      'Dual 75" Samsung QLED Displays for Singers and Audience',
      'Dedicated Ring-Light & Phone Mount for TikTok and Reel Creation',
      'DMX Controlled Moving Head LED Beams'
    ],
    houseRules: [
      'Shoes must be worn at all times (no stilettos on dance wood floor)',
      'Outside drinks allowed with corkage option',
      'Please treat props and stage lighting with care'
    ]
  },
  {
    id: 'room-rock-legends',
    name: 'Rock Legends Stage',
    theme: 'Rock & Metal',
    capacityTier: 'party',
    capacityText: '9 – 15 Guests',
    capacityMin: 9,
    capacityMax: 15,
    pricePerHour: 95,
    weekendPrice: 115,
    rating: 4.8,
    reviewsCount: 164,
    badge: 'Heavy Bass',
    featured: true,
    image: VOX_IMAGES.rooms.rockLegends,
    gallery: [
      VOX_IMAGES.rooms.rockLegends,
      VOX_IMAGES.hero.mainBg,
      VOX_IMAGES.addons.djMix
    ],
    tagline: 'Amplified sound stage with acoustic foam, smoke machine and rock memorabilia.',
    description: 'Unleash your inner rock god! Fitted with stadium-grade bass subwoofers, elevated vocalist riser platform, acoustic wall baffles, and authentic memorabilia from legendary stadium tours.',
    amenities: [
      { name: 'Twin 18" Subwoofers', icon: 'bi-volume-up-fill' },
      { name: 'Stage Platform', icon: 'bi-broadcast-pin' },
      { name: 'Safe Fog Effects', icon: 'bi-cloud-haze2' },
      { name: '4 Wireless Shure Mics', icon: 'bi-mic-fill' },
      { name: 'Bar Counter', icon: 'bi-cup-straw' },
      { name: 'Private Restroom', icon: 'bi-door-open-fill' }
    ],
    equipment: [
      'QSC K12.2 Active Loudspeakers with Dual KS118 Active Subwoofers',
      '4x Shure SM58 Wireless Microphone Units with Feedback Suppressors',
      '85" Sony Bravia Professional 4K Display',
      'Stage Fogger with Water-Based Hypoallergenic Mist',
      'Laser Strobe & Warm Rock Spotlights'
    ],
    houseRules: [
      'Do not jump into the speaker grilles or touch power amps',
      'Fog machine operated safely via wall push-button only',
      'Maximum 15 guests permitted'
    ]
  },
  {
    id: 'room-hiphop-lounge',
    name: 'Hip-Hop Boombox Lounge',
    theme: 'Urban & Hip-Hop',
    capacityTier: 'standard',
    capacityText: '5 – 8 Guests',
    capacityMin: 5,
    capacityMax: 8,
    pricePerHour: 68,
    weekendPrice: 82,
    rating: 4.9,
    reviewsCount: 98,
    badge: 'Deep 808s',
    featured: false,
    image: VOX_IMAGES.rooms.hiphopLounge,
    gallery: [
      VOX_IMAGES.rooms.hiphopLounge,
      VOX_IMAGES.addons.beverageBucket
    ],
    tagline: 'Graffiti mural walls, deep 808 bass tuning, and gold-accented boombox decor.',
    description: 'Custom graffiti art by local street artists, velvet booth seating, gold-plated microphone accessories, and custom sound tuning emphasizing punchy 808s and crisp rap vocal clarity.',
    amenities: [
      { name: '808 Bass Boost EQ', icon: 'bi-soundwave' },
      { name: 'Custom Graffiti Art', icon: 'bi-brush' },
      { name: 'Gold-Plated Mics', icon: 'bi-mic-fill' },
      { name: 'Plush Velvet Booth', icon: 'bi-lamp' },
      { name: 'Cocktail Calling Bell', icon: 'bi-bell-fill' },
      { name: 'Fast Phone Chargers', icon: 'bi-phone' }
    ],
    equipment: [
      'Bose F1 Model 812 Flexible Array Loudspeakers',
      '3x Custom Gold Finish Wireless Dynamic Mics',
      'Dual 65" UHD Monitors for 360-degree visibility',
      'Karaoke tablet with rapid rap search, lyric sync & BPM tap'
    ],
    houseRules: [
      'Respect velvet furniture fabrics',
      'Food & beverage service orders handled via wall tablet'
    ]
  },
  {
    id: 'room-disco-glam',
    name: 'Disco Glam Studio',
    theme: 'Disco & Funk',
    capacityTier: 'party',
    capacityText: '9 – 15 Guests',
    capacityMin: 9,
    capacityMax: 15,
    pricePerHour: 100,
    weekendPrice: 120,
    rating: 5.0,
    reviewsCount: 189,
    badge: 'Best for Birthdays',
    featured: true,
    image: VOX_IMAGES.rooms.discoGlam,
    gallery: [
      VOX_IMAGES.rooms.discoGlam,
      VOX_IMAGES.hero.ctaBanner,
      VOX_IMAGES.addons.balloonsDecor
    ],
    tagline: 'Giant motor-driven mirrorball, interactive LED dance floor, and studio glitter.',
    description: 'The ultimate party destination! Centered around a shimmering 30-inch motorized mirrorball, pressure-sensitive LED illuminated dance floor, and disco party lighting presets for non-stop dance anthems.',
    amenities: [
      { name: '30" Motorized Mirrorball', icon: 'bi-disc' },
      { name: 'LED Dance Floor Tiles', icon: 'bi-grid-3x3' },
      { name: '4 Wireless Microphones', icon: 'bi-mic-fill' },
      { name: 'Private Cocktail Bar', icon: 'bi-cup-straw' },
      { name: 'High-Res Projection', icon: 'bi-projector' },
      { name: 'Party Photo Backdrop', icon: 'bi-camera-reels' }
    ],
    equipment: [
      'Pioneer Pro Audio XPRS Series Surround Sound',
      'Interactive 12-panel LED dance floor reacting to bass drops',
      '4x Shure GLX-D+ Digital Wireless Vocal Systems',
      'Dual 75" Displays with Disco Visualizer screen saver'
    ],
    houseRules: [
      'No drinks allowed directly onto dancing tile surfaces',
      'Glitter/confetti poppers require venue staff pre-approval'
    ]
  },
  {
    id: 'room-tropical-luau',
    name: 'Tropical Luau Oasis',
    theme: 'Tiki & Chill',
    capacityTier: 'standard',
    capacityText: '5 – 8 Guests',
    capacityMin: 5,
    capacityMax: 8,
    pricePerHour: 55,
    weekendPrice: 65,
    rating: 4.7,
    reviewsCount: 76,
    badge: 'Chill Vibes',
    featured: false,
    image: VOX_IMAGES.rooms.tropicalLuau,
    gallery: [
      VOX_IMAGES.rooms.tropicalLuau,
      VOX_IMAGES.addons.snackPlatter
    ],
    tagline: 'Bamboo tiki bar finishes, exotic plant aesthetics, and warm sunset lighting.',
    description: 'Escape into an island getaway with warm amber and sunset lighting, bamboo acoustic panelling, faux palm greens, and tropical cocktail service right at your fingertips.',
    amenities: [
      { name: 'Tiki Bar Counter', icon: 'bi-cup-straw' },
      { name: 'Warm Sunset LEDs', icon: 'bi-sun' },
      { name: 'Harmon Kardon Sound', icon: 'bi-speaker' },
      { name: '3 Wireless Mics', icon: 'bi-mic-fill' },
      { name: 'Rattan Lounge Chairs', icon: 'bi-lamp' },
      { name: 'Aromatherapy Mists', icon: 'bi-flower1' }
    ],
    equipment: [
      'Harman Kardon Professional Audio array',
      '3x AKG WMS40 Mini Wireless Microphones',
      '65" High-Brightness 4K Monitor',
      'Digital touch drink ordering console'
    ],
    houseRules: [
      'No open flames or matches',
      'Enjoy drinks at bamboo bar tables'
    ]
  },
  {
    id: 'room-bollywood-beats',
    name: 'Bollywood Beats Palace',
    theme: 'Bollywood & Desi',
    capacityTier: 'party',
    capacityText: '9 – 15 Guests',
    capacityMin: 9,
    capacityMax: 15,
    pricePerHour: 90,
    weekendPrice: 110,
    rating: 4.9,
    reviewsCount: 133,
    badge: 'High Energy',
    featured: false,
    image: VOX_IMAGES.rooms.bollywoodBeats,
    gallery: [
      VOX_IMAGES.rooms.bollywoodBeats,
      VOX_IMAGES.addons.ledLightShow
    ],
    tagline: 'Royal jewel-toned drapery, gold chandeliers, and expansive South-Asian catalogue.',
    description: 'Immerse in grand cinematic royal glory with rich emerald and crimson accents, crystal chandeliers, specialized vocal pitch enhancement, and 40,000+ Hindi, Punjabi, Tamil, and Telugu hits.',
    amenities: [
      { name: 'Massive Desi Library', icon: 'bi-music-note-beamed' },
      { name: 'Royal Silk Booths', icon: 'bi-gem' },
      { name: 'Dual Vocal Reverb', icon: 'bi-sliders' },
      { name: '4 Wireless Microphones', icon: 'bi-mic-fill' },
      { name: 'Chandelier Dimming', icon: 'bi-lightbulb' },
      { name: 'Private Restroom', icon: 'bi-door-open' }
    ],
    equipment: [
      'Yamaha High-Output Club Series Sound',
      'Dual TC-Helicon VoiceLive Vocal processors for silky harmony reverb',
      '4x Sennheiser EW 100 G4 Wireless Vocal mics',
      'Twin 70" 4K displays with phonetic romanized lyrics toggle'
    ],
    houseRules: [
      'No footwear on white silk floor cushions',
      'Food platters should remain on side dining tables'
    ]
  },
  {
    id: 'room-anime-cyberpunk',
    name: 'Anime & J-Pop Cyberpunk',
    theme: 'Anime & Cyberpunk',
    capacityTier: 'mini',
    capacityText: '2 – 4 Guests',
    capacityMin: 2,
    capacityMax: 4,
    pricePerHour: 48,
    weekendPrice: 58,
    rating: 4.9,
    reviewsCount: 115,
    badge: 'Otaku Favorite',
    featured: false,
    image: VOX_IMAGES.rooms.animeCyberpunk,
    gallery: [
      VOX_IMAGES.rooms.animeCyberpunk,
      VOX_IMAGES.rooms.retro80s
    ],
    tagline: 'Neo-Tokyo neon street aesthetics, Joysound/DAM style interface and opening tracks.',
    description: 'Experience an authentic Akihabara karaoke box! Neon Japanese kanji signage, holographic acrylic art, full catalogs of classic and trending anime openings with Furigana & Romaji subtitle options.',
    amenities: [
      { name: 'Romaji / Kanji Subtitles', icon: 'bi-translate' },
      { name: 'Cyberpunk Neon Decor', icon: 'bi-lightning-charge' },
      { name: '2 Wireless Mics', icon: 'bi-mic-fill' },
      { name: 'Gaming Console Dock', icon: 'bi-controller' },
      { name: 'Anime Song Filters', icon: 'bi-music-player' },
      { name: 'LED Accent Shelves', icon: 'bi-lamp' }
    ],
    equipment: [
      'Pioneer DJ VM-80 Active Studio Monitors',
      '2x Shure BLX Wireless mics with custom pink and cyan windscreens',
      '55" Ultra-low latency Gaming & Video Display',
      'Dedicated Joysound/DAM Japanese interface emulation layer'
    ],
    houseRules: [
      'No drinks directly next to gaming dock equipment',
      'Maximum 4 occupants'
    ]
  },
  {
    id: 'room-midnight-jazz',
    name: 'Midnight Velvet Jazz Lounge',
    theme: 'Jazz & Speakeasy',
    capacityTier: 'vip',
    capacityText: '16 – 25 Guests',
    capacityMin: 16,
    capacityMax: 25,
    pricePerHour: 135,
    weekendPrice: 165,
    rating: 5.0,
    reviewsCount: 88,
    badge: 'Luxury Suite',
    featured: true,
    image: VOX_IMAGES.rooms.midnightJazz,
    gallery: [
      VOX_IMAGES.rooms.midnightJazz,
      VOX_IMAGES.addons.beverageBucket,
      VOX_IMAGES.addons.vipSongQueue
    ],
    tagline: 'Deep velvet booths, mahogany bar, brass instruments and audiophile sound.',
    description: 'An intimate speakeasy sanctuary with acoustic wood paneling, brass chandelier fixtures, full private bartender station, and studio-grade warm tube preamps for warm, velvety vocal reproduction.',
    amenities: [
      { name: 'Private Mixologist Bar', icon: 'bi-cup-straw' },
      { name: 'Vintage Shure 55SH Mic', icon: 'bi-mic' },
      { name: 'Dedicated Restroom', icon: 'bi-door-closed' },
      { name: '6 Wireless Microphones', icon: 'bi-mic-fill' },
      { name: 'Wine Cellar Cabinet', icon: 'bi-shield-check' },
      { name: 'Butler Call Button', icon: 'bi-bell' }
    ],
    equipment: [
      'Genelec 8040B Audiophile Studio Monitors with 7070A Subwoofer',
      '1x Vintage Shure 55SH Series II Chrome Vocal Mic on Stage Stand',
      '6x Shure Beta 58A Digital Wireless Handheld Mics',
      '85" Sony Master Series 4K Cinema Display',
      'Discrete personal bartender preparation station'
    ],
    houseRules: [
      'Smart casual attire encouraged in VIP lounge areas',
      'Personal bartender service available upon advance request'
    ]
  },
  {
    id: 'room-royal-vip',
    name: 'Royal VIP Penthouse Suite',
    theme: 'VIP Luxury',
    capacityTier: 'vip',
    capacityText: '16 – 25 Guests',
    capacityMin: 16,
    capacityMax: 25,
    pricePerHour: 160,
    weekendPrice: 195,
    rating: 5.0,
    reviewsCount: 174,
    badge: 'VIP Top Pick',
    featured: true,
    image: VOX_IMAGES.rooms.royalVIP,
    gallery: [
      VOX_IMAGES.rooms.royalVIP,
      VOX_IMAGES.addons.birthdayCake,
      VOX_IMAGES.addons.beverageBucket
    ],
    tagline: 'Penthouse skyline views, marble dining tables, gold accents and butler service.',
    description: 'The pinnacle of private karaoke luxury. Accommodates up to 25 guests with panoramic city views, plush custom Italian leather sectional sofas, private powder room, champagne ice wells, and private VIP server service.',
    amenities: [
      { name: 'VIP Butler Service', icon: 'bi-person-badge' },
      { name: 'Panoramic City Views', icon: 'bi-building' },
      { name: 'Champagne Ice Wells', icon: 'bi-cup-fill' },
      { name: '6 Wireless Shure Mics', icon: 'bi-mic-fill' },
      { name: 'Luxury Ensuite Restroom', icon: 'bi-door-closed-fill' },
      { name: 'Dual 85" Displays', icon: 'bi-tv-fill' }
    ],
    equipment: [
      'Custom L-Acoustics Architectural High-Fidelity Audio Rig',
      '6x Shure Axient Digital Wireless Microphones',
      'Dual 85" Samsung Neo QLED 8K Video Monitors',
      'Crestron iPad Environmental Control for Lights, Temp & Audio'
    ],
    houseRules: [
      '20% refundable security deposit required upon check-in',
      'Dedicated host included with package'
    ]
  },
  {
    id: 'room-grand-hall',
    name: 'Grand Symphony Hall',
    theme: 'Grand Corporate & Event',
    capacityTier: 'grand',
    capacityText: '26 – 40 Guests',
    capacityMin: 26,
    capacityMax: 40,
    pricePerHour: 220,
    weekendPrice: 265,
    rating: 4.9,
    reviewsCount: 92,
    badge: 'Largest Room',
    featured: true,
    image: VOX_IMAGES.rooms.grandHall,
    gallery: [
      VOX_IMAGES.rooms.grandHall,
      VOX_IMAGES.hero.ctaBanner,
      VOX_IMAGES.addons.photoBooth
    ],
    tagline: 'Our premier event space with 20-foot ceilings, full stage, buffet counters & DJ booth.',
    description: 'Built for corporate galas, milestone birthdays, and multi-team bashes. Features a 150-inch 4K laser projector, stage lighting trusses, dedicated DJ mixing station, hot buffet stations, and capacity for 40 singers.',
    amenities: [
      { name: '150" 4K Projector', icon: 'bi-projector-fill' },
      { name: 'Concert Stage & Truss', icon: 'bi-broadcast' },
      { name: 'DJ Console Ready', icon: 'bi-disc-fill' },
      { name: '8 Wireless Microphones', icon: 'bi-mic-fill' },
      { name: 'Buffet & Bar Station', icon: 'bi-basket2-fill' },
      { name: 'Dual Private Restrooms', icon: 'bi-door-open-fill' }
    ],
    equipment: [
      'Line Array Sound System with Quad Subwoofers (4000 Watts)',
      'Epson Pro Cinema 4K Laser Projector with Motorized Drop Screen',
      '8x Sennheiser Digital Handheld Microphones with Antenna Distro',
      'Chamsys QuickQ DMX Lighting Controller with Moving Gobo Fixtures',
      'Pioneer DDJ-FLX10 Mixer Booth Interface'
    ],
    houseRules: [
      'Mandatory catering coordinator contact 48 hours prior',
      'Strict 40 guest capacity limit'
    ]
  },
  {
    id: 'room-neon-galaxy',
    name: 'Neon Galaxy Future Stage',
    theme: 'Cyber Future & EDM',
    capacityTier: 'grand',
    capacityText: '26 – 40 Guests',
    capacityMin: 26,
    capacityMax: 40,
    pricePerHour: 240,
    weekendPrice: 280,
    rating: 5.0,
    reviewsCount: 104,
    badge: '360 LED Visuals',
    featured: false,
    image: VOX_IMAGES.rooms.neonGalaxy,
    gallery: [
      VOX_IMAGES.rooms.neonGalaxy,
      VOX_IMAGES.rooms.rockLegends
    ],
    tagline: '360-degree immersive wall-to-wall LED wrap visuals and heavy bass soundscapes.',
    description: 'Step into 2099! Featuring wrap-around reactive LED walls that morph with the song genre, spatial audio surround, computerized laser light shows, and an electric lounge layout for large high-energy parties.',
    amenities: [
      { name: '360 Reactive LED Walls', icon: 'bi-display' },
      { name: 'Spatial 7.2.4 Audio', icon: 'bi-speaker-fill' },
      { name: '8 Wireless Microphones', icon: 'bi-mic-fill' },
      { name: 'Full Wet Bar', icon: 'bi-cup-straw' },
      { name: 'Photo & Video Booth', icon: 'bi-camera-video-fill' },
      { name: 'Private Restrooms', icon: 'bi-door-closed' }
    ],
    equipment: [
      'Martin Audio CDD Series 16-channel spatial audio cluster',
      'Unreal Engine-driven interactive LED wall rendering engine',
      '8x Shure Axient Digital Microphones with rechargeable lithium stations',
      'Automated high-framerate party video recording system with direct download QR'
    ],
    houseRules: [
      'Do not touch or lean on LED video wall panels',
      'Complimentary sound technician on standby during event'
    ]
  }
];

if (typeof window !== 'undefined') {
  window.VOX_ROOMS = VOX_ROOMS;
  window.VIBE_ROOMS = VOX_ROOMS;
}
