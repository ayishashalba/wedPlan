export const INITIAL_SERVICES = [
  // --- HALLS ---
  {
    id: 'hall-1',
    vendorId: 'vendor-1',
    name: 'Bolgatty Palace & Island Convention Centre',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    location: 'Mulavukad, Kochi',
    district: 'Ernakulam (Kochi)',
    address: 'Bolgatty Island, Mulavukad, Kochi, Kerala 682504',
    price: 185000,
    priceUnit: 'per day',
    capacity: 1500,
    rating: 4.9,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545232979-fbf87595b3b5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Set amidst picturesque backwaters on Bolgatty Island, this heritage venue blends royal Dutch architecture with sprawling waterfront lawns and an air-conditioned banquet hall capable of hosting grand Kerala celebrations.',
    facilities: [
      'Centralized Air Conditioning',
      'Sprawling Waterfront Lawns',
      'Dedicated Bridal Suites & Green Rooms',
      'Valet Parking for 500+ Vehicles',
      'In-house Genset Power Backup (100%)',
      'Floating Banquet Deck for Photoshoots'
    ],
    status: 'active',
    featured: true
  },
  {
    id: 'hall-2',
    vendorId: 'vendor-2',
    name: 'Al Saj Convention Centre & Royale Banquets',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    location: 'Kazhakkoottam, Thiruvananthapuram',
    district: 'Thiruvananthapuram',
    address: 'NH 66 Bypass, Kazhakkoottam, Thiruvananthapuram, Kerala 695582',
    price: 140000,
    priceUnit: 'per day',
    capacity: 2200,
    rating: 4.8,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'South Kerala’s most renowned luxury banquet destination featuring column-free pillarless halls, state-of-the-art acoustic sound engineering, and regal gold chandeliers.',
    facilities: [
      'Pillarless Grand Ballroom',
      'Seating for 2,200 Guests',
      'High Speed WiFi & AV Console',
      'Massive Dining Hall with 800 seats',
      'Multi-level Car Parking',
      'VIP Lounge'
    ],
    status: 'active',
    featured: true
  },
  {
    id: 'hall-3',
    vendorId: 'vendor-3',
    name: 'Gokulam Park Grand Convention Centre',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    location: 'Arayidathupalam, Kozhikode',
    district: 'Kozhikode',
    address: 'Mavoor Road, Kozhikode, Kerala 673004',
    price: 125000,
    priceUnit: 'per day',
    capacity: 1200,
    rating: 4.7,
    reviewCount: 76,
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Conveniently situated in Calicut city centre with opulent stage rigging, modern culinary service quarters, and a warm wooden acoustic interior.',
    facilities: [
      'Acoustic Ceiling Panels',
      'Separate Veg / Non-Veg Kitchens',
      'Ample Car Parking',
      'Dressing Rooms with En-suite Baths',
      'Central Air Conditioning'
    ],
    status: 'active',
    featured: false
  },
  {
    id: 'hall-4',
    vendorId: 'vendor-4',
    name: 'Sobha City Mirage Convention Hall',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    location: 'Puzhakkal, Thrissur',
    district: 'Thrissur',
    address: 'Sobha City, Puzhakkal, Thrissur, Kerala 680553',
    price: 160000,
    priceUnit: 'per day',
    capacity: 1800,
    rating: 4.9,
    reviewCount: 114,
    image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Located next to Thrissur’s premier lakeside complex, offering a majestic venue with crystal fixtures, grand red-carpet entryway and scenic lake reflections.',
    facilities: [
      'Lakefront Promenade',
      'State-of-the-art DMX Stage Lighting',
      'Covered Multi-story Parking',
      'Dedicated Catering Service Elevators',
      '24/7 Security & CCTV'
    ],
    status: 'active',
    featured: true
  },

  // --- CATERING ---
  {
    id: 'cat-1',
    vendorId: 'vendor-5',
    name: 'Annapoorna Royal Kerala Sadya & Feasts',
    category: 'catering',
    categoryLabel: 'Catering',
    location: 'Panampilly Nagar, Kochi',
    district: 'Ernakulam (Kochi)',
    address: 'Main Avenue, Panampilly Nagar, Kochi, Kerala 682036',
    price: 450,
    priceUnit: 'per person',
    foodType: 'Pure Vegetarian & Traditional',
    rating: 4.9,
    reviewCount: 210,
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Legendary authentic 28-dish Kerala Sadya served on fresh banana leaves with pure Travancore ghee, crisp sharkara varatti, double payasams (Palada & Parippu), and royal hospitality.',
    menuHighlights: [
      'Authentic 28-course Traditional Sadya',
      'Ghee Palada Payasam & Ada Pradhaman',
      'Avial, Thoran, Olan, Kalan & Erissery',
      'Puli Inji & 4 varieties of fresh pickles',
      'Live Appam & Stew Counter option'
    ],
    status: 'active',
    featured: true
  },
  {
    id: 'cat-2',
    vendorId: 'vendor-6',
    name: 'Malabar Dum Biryani & Mughal Banquets',
    category: 'catering',
    categoryLabel: 'Catering',
    location: 'Beach Road, Kozhikode',
    district: 'Kozhikode',
    address: 'Near Corporation Stadium, Beach Road, Kozhikode, Kerala 673001',
    price: 550,
    priceUnit: 'per person',
    foodType: 'Non-Vegetarian & Halal Speciality',
    rating: 4.8,
    reviewCount: 185,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Famous Thalassery & Kozhikodan dum biryani prepared with fragrant Jeerakasala rice, tender Malabar mutton, sulaimani tea bar, live pathiri stations, and decadent coastal desserts.',
    menuHighlights: [
      'Kozhikode Dum Chicken & Mutton Biryani',
      'Live Soft Ari Pathiri & Alleppey Fish Curry',
      'Fresh Malabar Sea Food Starters',
      'Traditional Sulaimani & Halwa Stalls',
      'Caramel Custard & Tender Coconut Pudding'
    ],
    status: 'active',
    featured: true
  },

  // --- DECORATION ---
  {
    id: 'dec-1',
    vendorId: 'vendor-7',
    name: 'Mayflower Luxury Stage & Floral Decors',
    category: 'decoration',
    categoryLabel: 'Decoration',
    location: 'Kadavanthra, Kochi',
    district: 'Ernakulam (Kochi)',
    address: 'Metro Pillar 812, Kadavanthra, Kochi, Kerala 682020',
    price: 75000,
    priceUnit: 'starting price',
    themes: ['Traditional Kerala Temple', 'Royal Champagne Gold', 'Bohemian Pastel', 'Backwater Floral Canopy'],
    rating: 4.9,
    reviewCount: 130,
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Award-winning stage artisans crafting breathtaking mandapams, fragrant jasmine & lotus hangings, customized fairy light pathways, and majestic entry arches tailored to your wedding vision.',
    servicesIncluded: [
      'Custom Mandapam Design with Fresh Flowers',
      'Grand Entrance Floral Arch & Walkway Lights',
      'LED Stage Backdrops & Atmospheric Lighting',
      'Photo Booths & Selfie Corners',
      'Bridal Seating Furniture & Table Centrepieces'
    ],
    status: 'active',
    featured: true
  },
  {
    id: 'dec-2',
    vendorId: 'vendor-8',
    name: 'Vedic Blooms & Traditional Stagecraft',
    category: 'decoration',
    categoryLabel: 'Decoration',
    location: 'Swaraj Round, Thrissur',
    district: 'Thrissur',
    address: 'East Fort Gate, Swaraj Round, Thrissur, Kerala 680005',
    price: 60000,
    priceUnit: 'starting price',
    themes: ['Kerala Mural & Brass Nilavilakku', 'Vibrant Sangeet Floral', 'Marigold Glow'],
    rating: 4.7,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Specialists in classic Kerala temple wedding aesthetics featuring hand-carved brass nilavilakku lamps, fresh chethi, mulla and marigold installations.',
    servicesIncluded: [
      'Brass Nilavilakku and Uruli Arrangements',
      'Fresh Jasmine & Marigold Stage Backdrop',
      'Traditional Peetam & Kolam Floor Art',
      'Entry Pathway Lanterns'
    ],
    status: 'active',
    featured: false
  },

  // --- PHOTOGRAPHY ---
  {
    id: 'photo-1',
    vendorId: 'vendor-9',
    name: 'Lumiere Wedding Stories & Films',
    category: 'photography',
    categoryLabel: 'Photography',
    location: 'Ravipuram, Kochi',
    district: 'Ernakulam (Kochi)',
    address: 'M.G. Road, Ravipuram, Kochi, Kerala 682016',
    price: 90000,
    priceUnit: '2-day full coverage',
    videography: true,
    rating: 5.0,
    reviewCount: 165,
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Internationally published wedding storytellers specializing in intimate candid portraits, cinematic 4K teaser reels, drone aerial videography, and handcrafted Italian leather albums.',
    packagesOffered: [
      '2-day Candid Photography & 4K Cinema Coverage',
      'Cinematic Wedding Teaser (3-5 mins) & Full Film',
      'Drone Aerial Videography for Venue & Muhurtham',
      'Pre-wedding / Post-wedding Scenic Backwater Shoot',
      'Premium 50-page Flush Mount Wedding Album'
    ],
    status: 'active',
    featured: true
  },
  {
    id: 'photo-2',
    vendorId: 'vendor-10',
    name: 'Monsoon Tales Cinematics',
    category: 'photography',
    categoryLabel: 'Photography',
    location: 'Kowdiar, Thiruvananthapuram',
    district: 'Thiruvananthapuram',
    address: 'Near Golf Club, Kowdiar, Thiruvananthapuram, Kerala 695003',
    price: 70000,
    priceUnit: '1-day coverage',
    videography: true,
    rating: 4.8,
    reviewCount: 92,
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Passionate visual poets capturing natural laughter, sacred traditional rituals, and vibrant sangeet dances with warm, timeless Kerala color tones.',
    packagesOffered: [
      'Traditional + Candid Combined Coverage',
      'High-Resolution Edited Digital Archives',
      'Instagram Reels Package (Same Day Edit)',
      'Complimentary Engagement Session'
    ],
    status: 'active',
    featured: false
  },

  // --- EVENT MANAGEMENT ---
  {
    id: 'event-1',
    vendorId: 'vendor-11',
    name: 'Unicorn Destination Weddings & Celebrations',
    category: 'event-management',
    categoryLabel: 'Event Management',
    location: 'Edappally, Kochi',
    district: 'Ernakulam (Kochi)',
    address: 'Toll Junction, Edappally, Kochi, Kerala 682024',
    price: 150000,
    priceUnit: 'planning fee',
    rating: 4.9,
    reviewCount: 110,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Kerala’s flagship wedding coordination house delivering end-to-end luxury management: guest logistics, celebrity anchors, chenda melam artists, bespoke styling, and flawless day-of execution.',
    servicesOffered: [
      'Complete End-to-End Wedding Planning & Checklist',
      'Guest Hospitality, Hotel Blocks & Luxury Fleet Logistics',
      'Panchavadyam, Chenda Melam & Fusion Band Booking',
      'Vendor Coordination & Timeline Supervision',
      'Bride & Groom Personal Styling Assistance'
    ],
    status: 'active',
    featured: true
  }
];

export const INITIAL_PACKAGES = [
  {
    id: 'pkg-1',
    name: 'The Royal Travancore Grand Wedding Package',
    tagline: 'Complete 360-degree luxury celebration for up to 800 guests',
    price: 499000,
    discountPrice: 449000,
    duration: '2 Days (Engagement + Wedding / Reception)',
    district: 'Ernakulam (Kochi)',
    rating: 4.9,
    reviewCount: 54,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    description: 'Our most sought-after royal bundle combining luxury venue, traditional 28-dish feast, lavish floral mandapam, 4K candid cinema, and full event coordinator support.',
    includes: [
      { category: 'Wedding Hall', item: 'Bolgatty Palace Island Grand Ballroom (Full Day)' },
      { category: 'Catering', item: 'Annapoorna Royal Kerala Sadya for 600 Guests + Payasam Bar' },
      { category: 'Decoration', item: 'Mayflower Grand Champagne Gold Mandapam with Fresh Jasmine' },
      { category: 'Photography', item: 'Lumiere Stories 2-Day Candid Cinema & Drone Coverage' },
      { category: 'Event Coordination', item: 'Dedicated Day-of Concierge Team (6 coordinators)' }
    ],
    highlights: [
      'Save over ₹85,000 compared to individual vendor booking',
      'One single dedicated wedding coordinator',
      'Customized menu tasting session included',
      'Complimentary bridal suite & luxury boat transport for couple'
    ],
    featured: true
  },
  {
    id: 'pkg-2',
    name: 'Backwater Bliss Heritage Package',
    tagline: 'Romantic destination wedding set on Kerala’s serene waterways',
    price: 365000,
    discountPrice: 325000,
    duration: '1 Full Day',
    district: 'Alappuzha',
    rating: 4.8,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1545232979-fbf87595b3b5?auto=format&fit=crop&w=1200&q=80',
    description: 'Intimate, picturesque waterfront celebration featuring houseboat cruise reception, authentic coastal seafood and sadya, pastel floral canopy, and candid cinematography.',
    includes: [
      { category: 'Venue', item: 'Lakefront Waterfront Lawn & Heritage Hall' },
      { category: 'Catering', item: 'Coastal Sadya & Karimeen Fry feast for 400 guests' },
      { category: 'Decoration', item: 'Pastel Botanical Mandapam with Fairy Light Pathway' },
      { category: 'Photography', item: 'Full Day Candid Photography & Drone Backwater Reel' },
      { category: 'Entertainment', item: 'Traditional Sopana Sangeetham & Flute Ensemble' }
    ],
    highlights: [
      'Sunset Houseboat Cruise for Bride & Groom',
      'Panchavadyam welcome procession for wedding party',
      'Complete waste management & eco-friendly decor'
    ],
    featured: true
  },
  {
    id: 'pkg-3',
    name: 'Malabar Splendour Nikah & Reception Package',
    tagline: 'Opulent celebration with authentic Kozhikodan cuisine & royal stage',
    price: 395000,
    discountPrice: 350000,
    duration: '1 Full Day',
    district: 'Kozhikode',
    rating: 4.9,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    description: 'Crafted for unforgettable celebrations in North Kerala featuring legendary Dum Biryani, royal Mughal stage design, live Doffmuttu artists, and full cinematic coverage.',
    includes: [
      { category: 'Venue', item: 'Gokulam Park Grand Banquet Hall' },
      { category: 'Catering', item: 'Malabar Dum Biryani, Pathiri & Dessert Bar for 700 guests' },
      { category: 'Decoration', item: 'Royal White & Gold Stage with Crystal Chandeliers' },
      { category: 'Photography', item: 'Cinematic Teaser, Pre-Shoot & Complete Wedding Album' },
      { category: 'Live Music', item: 'Live Ghazal & Sufi Fusion Performance' }
    ],
    highlights: [
      'Authentic Dum Biryani cooked on traditional firewood by Master Usthad',
      'VIP lounge seating arrangement included'
    ],
    featured: true
  }
];

export const INITIAL_VENDORS = [
  {
    id: 'vendor-1',
    businessName: 'Bolgatty Hospitality Group',
    ownerName: 'Mathew Varghese',
    email: 'bolgatty@wedplan.com',
    phone: '+91 98470 12345',
    category: 'Wedding Hall',
    district: 'Ernakulam (Kochi)',
    city: 'Kochi',
    address: 'Bolgatty Island, Mulavukad, Kochi, Kerala 682504',
    yearsExperience: 18,
    status: 'approved',
    rating: 4.9,
    servicesCount: 1,
    logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80',
    description: 'Premier heritage hospitality provider offering iconic waterfront destination wedding venues across central Kerala.',
    registeredAt: '2025-01-15'
  },
  {
    id: 'vendor-5',
    businessName: 'Annapoorna Caterers & Banquets',
    ownerName: 'Suresh Kumar',
    email: 'annapoorna@wedplan.com',
    phone: '+91 94471 23456',
    category: 'Catering',
    district: 'Ernakulam (Kochi)',
    city: 'Kochi',
    address: 'Panampilly Nagar, Kochi, Kerala 682036',
    yearsExperience: 22,
    status: 'approved',
    rating: 4.9,
    servicesCount: 1,
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
    description: 'Masters of authentic Kerala Sadya and royal wedding feasts catering to over 5,000 weddings since 2002.',
    registeredAt: '2025-02-01'
  },
  {
    id: 'vendor-9',
    businessName: 'Lumiere Wedding Stories',
    ownerName: 'Akhil & Neha Menon',
    email: 'lumiere@wedplan.com',
    phone: '+91 97452 34567',
    category: 'Photography',
    district: 'Ernakulam (Kochi)',
    city: 'Kochi',
    address: 'Ravipuram, M.G Road, Kochi, Kerala 682016',
    yearsExperience: 10,
    status: 'approved',
    rating: 5.0,
    servicesCount: 1,
    logo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&q=80',
    description: 'Top-tier candid cinematography and storytelling agency working across Kochi, Trivandrum, and international destinations.',
    registeredAt: '2025-02-10'
  },
  {
    id: 'vendor-new-1',
    businessName: 'Royal Palm Convention Centre',
    ownerName: 'Faisal Mohammed',
    email: 'faisal.royalpalm@gmail.com',
    phone: '+91 98950 88990',
    category: 'Wedding Hall',
    district: 'Kozhikode',
    city: 'Kozhikode',
    address: 'Kallai Road, Kozhikode, Kerala 673003',
    yearsExperience: 4,
    status: 'pending',
    rating: 0,
    servicesCount: 0,
    logo: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=200&q=80',
    description: 'Newly constructed 2500-capacity air conditioned convention hall awaiting verification for platform launch.',
    registeredAt: '2026-10-28'
  },
  {
    id: 'vendor-new-2',
    businessName: 'Flora & Fern Stage Designers',
    ownerName: 'Deepa Nair',
    email: 'deepa.florafern@gmail.com',
    phone: '+91 94460 77112',
    category: 'Decoration',
    district: 'Kottayam',
    city: 'Kottayam',
    address: 'Kanjikuzhy, Kottayam, Kerala 686004',
    yearsExperience: 6,
    status: 'pending',
    rating: 0,
    servicesCount: 0,
    logo: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=200&q=80',
    description: 'Eco-conscious wedding styling firm specializing in zero-plastic, natural flower installations.',
    registeredAt: '2026-11-01'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Anjali Menon & Rahul Pillai',
    email: 'anjali@example.com',
    phone: '+91 98460 99887',
    district: 'Ernakulam (Kochi)',
    status: 'active',
    registeredAt: '2025-03-12',
    totalBookings: 2
  },
  {
    id: 'cust-2',
    name: 'Dr. Vivek Kurian',
    email: 'vivek.kurian@example.com',
    phone: '+91 94470 55443',
    district: 'Kottayam',
    status: 'active',
    registeredAt: '2025-04-05',
    totalBookings: 1
  },
  {
    id: 'cust-3',
    name: 'Nikhila Thomas',
    email: 'nikhila.t@example.com',
    phone: '+91 97440 22331',
    district: 'Thrissur',
    status: 'active',
    registeredAt: '2025-05-18',
    totalBookings: 1
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'BK-78901',
    customerId: 'cust-1',
    customerName: 'Anjali Menon',
    customerEmail: 'anjali@example.com',
    customerPhone: '+91 98460 99887',
    vendorId: 'vendor-1',
    vendorName: 'Bolgatty Hospitality Group',
    serviceId: 'hall-1',
    serviceName: 'Bolgatty Palace & Island Convention Centre',
    serviceCategory: 'hall',
    eventType: 'Wedding Ceremony & Reception',
    eventDate: '2026-12-18',
    eventTime: '09:30 AM',
    guestCount: 850,
    location: 'Bolgatty Island, Kochi',
    price: 185000,
    status: 'confirmed',
    additionalRequirements: 'Need early morning access for stage setup from 4:00 AM. Extra parking attendants requested.',
    createdAt: '2026-09-15'
  },
  {
    id: 'BK-78902',
    customerId: 'cust-1',
    customerName: 'Anjali Menon',
    customerEmail: 'anjali@example.com',
    customerPhone: '+91 98460 99887',
    vendorId: 'vendor-5',
    vendorName: 'Annapoorna Caterers & Banquets',
    serviceId: 'cat-1',
    serviceName: 'Annapoorna Royal Kerala Sadya (850 Guests)',
    serviceCategory: 'catering',
    eventType: 'Wedding Sadya',
    eventDate: '2026-12-18',
    eventTime: '12:00 PM',
    guestCount: 850,
    location: 'Bolgatty Island Dining Hall, Kochi',
    price: 382500,
    status: 'pending',
    additionalRequirements: 'Extra Ada Pradhaman counter. Strict hygienic food safety gear for all service staff.',
    createdAt: '2026-10-02'
  },
  {
    id: 'BK-78903',
    customerId: 'cust-2',
    customerName: 'Dr. Vivek Kurian',
    customerEmail: 'vivek.kurian@example.com',
    customerPhone: '+91 94470 55443',
    vendorId: 'vendor-9',
    vendorName: 'Lumiere Wedding Stories',
    serviceId: 'photo-1',
    serviceName: 'Lumiere Candid Cinema 2-Day Package',
    serviceCategory: 'photography',
    eventType: 'Engagement & Wedding',
    eventDate: '2027-01-10',
    eventTime: 'Full Day',
    guestCount: 500,
    location: 'Windsor Castle, Kottayam',
    price: 90000,
    status: 'confirmed',
    additionalRequirements: 'Drone flight clearance for church grounds arranged. Requires teaser delivery within 72 hours.',
    createdAt: '2026-10-14'
  },
  {
    id: 'BK-78904',
    customerId: 'cust-3',
    customerName: 'Nikhila Thomas',
    customerEmail: 'nikhila.t@example.com',
    customerPhone: '+91 97440 22331',
    vendorId: 'vendor-1',
    vendorName: 'Bolgatty Hospitality Group',
    serviceId: 'hall-1',
    serviceName: 'Bolgatty Palace & Island Convention Centre',
    serviceCategory: 'hall',
    eventType: 'Corporate Gala',
    eventDate: '2026-11-25',
    eventTime: '06:00 PM',
    guestCount: 400,
    location: 'Bolgatty Island, Kochi',
    price: 185000,
    status: 'completed',
    additionalRequirements: 'Audio visual presentation screen required.',
    createdAt: '2026-08-20'
  }
];

export const DEMO_USERS = {
  customer: {
    id: 'cust-1',
    name: 'Anjali Menon',
    email: 'anjali@example.com',
    role: 'customer',
    phone: '+91 98460 99887',
    district: 'Ernakulam (Kochi)'
  },
  vendor: {
    id: 'vendor-1',
    name: 'Mathew Varghese',
    businessName: 'Bolgatty Hospitality Group',
    email: 'bolgatty@wedplan.com',
    role: 'vendor',
    phone: '+91 98470 12345',
    status: 'approved',
    district: 'Ernakulam (Kochi)'
  },
  admin: {
    id: 'admin-1',
    name: 'WedPlan Administrator',
    email: 'admin@wedplan.com',
    role: 'admin',
    phone: '+91 94000 00000',
    district: 'Ernakulam (Kochi)'
  }
};

