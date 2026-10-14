/**
 * VibeVault - Image Assets Configuration
 * Centralized high-resolution photographic assets.
 * Easily replace these URLs with your own local or hosted assets.
 */

const VOX_IMAGES = {
  // Brand & Logos
  logo: {
    icon: 'bi bi-soundwave',
    brandName: 'VibeVault',
    tagline: 'Karaoke & Private Party Rooms'
  },

  // Hero & Banners
  hero: {
    mainBg: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920&q=85',
    singer: 'assets/images/vocal-warmups-guide.jpg',
    partyLounge: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    ctaBanner: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=85'
  },

  // 12 Themed Rooms
  rooms: {
    retro80s: 'assets/images/rooms/suite-retro-80s.jpg',
    kpopStudio: 'assets/images/rooms/suite-kpop-studio.jpg',
    rockLegends: 'assets/images/rooms/suite-rock-legends.jpg',
    hiphopLounge: 'assets/images/rooms/suite-hiphop-lounge.jpg',
    discoGlam: 'assets/images/rooms/suite-disco-glam.jpg',
    tropicalLuau: 'assets/images/rooms/suite-tropical-luau.jpg',
    bollywoodBeats: 'assets/images/rooms/suite-bollywood-palace.jpg',
    animeCyberpunk: 'assets/images/rooms/suite-anime-cyberpunk.jpg',
    midnightJazz: 'assets/images/rooms/suite-midnight-jazz.jpg',
    royalVIP: 'assets/images/rooms/suite-royal-vip.jpg',
    grandHall: 'assets/images/rooms/suite-grand-hall.jpg',
    neonGalaxy: 'assets/images/rooms/suite-neon-galaxy.jpg'
  },

  // Packages & Add-ons
  packages: {
    jamSession: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    partyStarter: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
    birthdayBash: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    corporateMixer: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    vipPlatinum: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
  },

  addons: {
    snackPlatter: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    beverageBucket: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    birthdayCake: 'assets/images/celebration-cake.jpg',
    balloonsDecor: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
    photoBooth: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80',
    mcHost: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
    djMix: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    extraHour: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    proMics: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
    ledLightShow: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    vipSongQueue: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
  },

  // Occasions
  occasions: {
    birthday: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
    bachelorette: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    corporate: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    dateNight: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=800&q=80',
    friends: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    anniversary: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
  },

  // Testimonials
  testimonials: [
    {
      name: 'Elena Rostova',
      role: 'Birthday Host & Singer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      comment: 'The Neon Retro 80s room blew our minds! Crystal clear audio, 4 wireless mics, and ordering drinks directly from the tablet was effortless.',
      rating: 5,
      room: 'Neon Retro 80s Room'
    },
    {
      name: 'Marcus Chen',
      role: 'Tech Lead @ Omnia',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      comment: 'Hosted our quarterly corporate mixer in the Grand Symphony Hall. The team loved the song library diversity and the catering platters were five-star.',
      rating: 5,
      room: 'Grand Symphony Hall'
    },
    {
      name: 'Sophia Patel',
      role: 'Bachelorette Organizer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      comment: 'Booking was so simple with the slot picker! The K-Pop studio lights and disco effects made our bridal party videos look like a real music video.',
      rating: 5,
      room: 'K-Pop Idol Studio'
    }
  ],

  // Gallery
  gallery: [
    { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80', title: 'Neon Lounge Atmosphere' },
    { url: 'assets/images/vocal-warmups-guide.jpg', title: 'Studio Vocals Setup' },
    { url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1000&q=80', title: 'Disco Mirrorball Glow' },
    { url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=80', title: 'Signature Cocktails' },
    { url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80', title: 'Party Finger Food Platters' },
    { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80', title: 'VIP Sound System' }
  ]
};

// Export to window
if (typeof window !== 'undefined') {
  window.VOX_IMAGES = VOX_IMAGES;
  window.VIBE_IMAGES = VOX_IMAGES;
}
