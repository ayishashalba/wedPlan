import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import VendorProfile from '../models/VendorProfile.js';
import Service from '../models/Service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const DEMO_SERVICES = [
  // ── 1. ERNAKULAM (KOCHI) ──────────────────────────────────────────────────────────
  {
    serviceName: 'Bolgatty Palace & Island Convention Centre',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    district: 'Ernakulam (Kochi)',
    city: 'Kochi',
    location: 'Bolgatty Island, Mulavukad, Kochi',
    address: 'Bolgatty Island, Mulavukad, Kochi, Kerala 682504',
    price: 185000,
    priceType: 'per-event',
    priceUnit: 'per day',
    guestCapacity: 1500,
    rating: 4.9,
    reviewCount: 142,
    featured: true,
    vendorName: 'Bolgatty Hospitality Group',
    phone: '+91 98470 12345',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545232979-fbf87595b3b5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Set amidst picturesque backwaters on Bolgatty Island, this heritage venue blends royal Dutch architecture with sprawling waterfront lawns and an air-conditioned banquet ballroom.',
    features: ['Centralized Air Conditioning', 'Sprawling Waterfront Lawns', 'Valet Parking for 500+ Vehicles', 'Bridal Suites & Green Rooms', '100% Genset Power Backup']
  },
  {
    serviceName: 'Annapoorna Royal Kerala Sadya & Feasts',
    category: 'catering',
    categoryLabel: 'Catering Service',
    district: 'Ernakulam (Kochi)',
    city: 'Kochi',
    location: 'Panampilly Nagar, Kochi',
    address: 'Main Avenue, Panampilly Nagar, Kochi, Kerala 682036',
    price: 450,
    priceType: 'per-person',
    priceUnit: 'per plate',
    guestCapacity: 1200,
    rating: 4.9,
    reviewCount: 210,
    featured: true,
    vendorName: 'Annapoorna Caterers & Banquets',
    phone: '+91 94471 23456',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Legendary authentic 28-dish traditional Kerala sadya served on fresh banana leaves with pure Travancore ghee, crisp sharkara varatti, double payasams (Palada & Parippu), and royal hospitality.',
    features: ['28-dish Authentic Sadya', 'Palada & Parippu Payasam', 'Live Appam & Stew Counter', 'Uniformed Traditional Serving Crew', 'Banana Leaf Eco-Service']
  },
  {
    serviceName: 'Mayflower Luxury Stage & Floral Decors',
    category: 'decoration',
    categoryLabel: 'Stage & Floral Decor',
    district: 'Ernakulam (Kochi)',
    city: 'Kochi',
    location: 'Kadavanthra, Kochi',
    address: 'Metro Pillar 812, Kadavanthra, Kochi, Kerala 682020',
    price: 75000,
    priceType: 'per-event',
    priceUnit: 'starting price',
    guestCapacity: 0,
    rating: 4.9,
    reviewCount: 130,
    featured: true,
    vendorName: 'Mayflower Decorators',
    phone: '+91 98470 54321',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Award-winning stage artisans crafting breathtaking mandapams, fragrant jasmine & lotus installations, customized fairy light walkways, and majestic floral entrance arches.',
    features: ['Fresh Exotic & Traditional Florals', 'DMX Stage Atmospheric Lighting', 'Custom Entrance Arches', 'Mandapam & Photobooth Setup']
  },
  {
    serviceName: 'Lumiere Wedding Stories & Candid Cinema',
    category: 'photography',
    categoryLabel: 'Photography & Cinema',
    district: 'Ernakulam (Kochi)',
    city: 'Kochi',
    location: 'Ravipuram, Kochi',
    address: 'M.G. Road, Ravipuram, Kochi, Kerala 682016',
    price: 90000,
    priceType: 'per-event',
    priceUnit: 'package',
    guestCapacity: 0,
    rating: 5.0,
    reviewCount: 165,
    featured: true,
    vendorName: 'Lumiere Wedding Stories',
    phone: '+91 97452 34567',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Internationally recognized visual storytellers specializing in intimate candid portraits, cinematic 4K teaser reels, licensed drone videography, and handcrafted flush-mount albums.',
    features: ['4K Cinematic Teaser Reel', 'Full Day Candid & Traditional', 'Licensed Drone Aerial Footage', 'Premium Leatherbound Album', 'Raw Footage Drive']
  },
  {
    serviceName: 'Unicorn Destination Weddings & Event Management',
    category: 'event-management',
    categoryLabel: 'Event Management',
    district: 'Ernakulam (Kochi)',
    city: 'Kochi',
    location: 'Edappally, Kochi',
    address: 'Toll Junction, Edappally, Kochi, Kerala 682024',
    price: 150000,
    priceType: 'per-event',
    priceUnit: 'planning fee',
    guestCapacity: 0,
    rating: 4.9,
    reviewCount: 110,
    featured: true,
    vendorName: 'Unicorn Events Kerala',
    phone: '+91 98460 11223',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Kerala’s flagship wedding coordination firm delivering end-to-end luxury management: guest hospitality, fleet logistics, live chenda melam artists, venue styling, and day-of execution.',
    features: ['End-to-End Coordination', 'Guest Logistics & Hotel Blocks', 'Panchavadyam & Melam Booking', 'Celebrity Anchor Coordination', 'Timeline Supervision']
  },

  // ── 2. THIRUVANANTHAPURAM ──────────────────────────────────────────────────────────
  {
    serviceName: 'Al Saj Convention Centre & Royale Banquets',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    district: 'Thiruvananthapuram',
    city: 'Kazhakkoottam',
    location: 'NH 66 Bypass, Kazhakkoottam',
    address: 'NH 66 Bypass, Kazhakkoottam, Thiruvananthapuram, Kerala 695582',
    price: 140000,
    priceType: 'per-event',
    priceUnit: 'per day',
    guestCapacity: 2200,
    rating: 4.8,
    reviewCount: 98,
    featured: true,
    vendorName: 'Al Saj Hospitality',
    phone: '+91 94470 98765',
    image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'South Kerala’s most renowned luxury banquet destination featuring column-free pillarless halls, state-of-the-art acoustic engineering, and regal chandeliers.',
    features: ['Pillarless Grand Ballroom', 'Capacity up to 2,200', 'Separate 800-seat Dining Hall', 'Multi-level Parking', 'VIP Lounge']
  },
  {
    serviceName: 'Monsoon Tales Cinematics & Teasers',
    category: 'photography',
    categoryLabel: 'Photography & Cinema',
    district: 'Thiruvananthapuram',
    city: 'Kowdiar',
    location: 'Near Golf Club, Kowdiar',
    address: 'Near Golf Club, Kowdiar, Thiruvananthapuram, Kerala 695003',
    price: 70000,
    priceType: 'per-event',
    priceUnit: 'package',
    guestCapacity: 0,
    rating: 4.8,
    reviewCount: 92,
    featured: false,
    vendorName: 'Monsoon Tales Photography',
    phone: '+91 94470 87654',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Passionate visual poets capturing natural laughter, sacred traditional rituals, and vibrant sangeet dances with warm, timeless Kerala color tones.',
    features: ['Traditional & Candid Combined', 'High-Res Digital Archives', 'Same-Day Instagram Reel', 'Complimentary Pre-Shoot']
  },

  // ── 3. KOZHIKODE ──────────────────────────────────────────────────────────
  {
    serviceName: 'Gokulam Park Grand Convention Centre',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    district: 'Kozhikode',
    city: 'Kozhikode',
    location: 'Mavoor Road, Kozhikode',
    address: 'Mavoor Road, Kozhikode, Kerala 673004',
    price: 125000,
    priceType: 'per-event',
    priceUnit: 'per day',
    guestCapacity: 1200,
    rating: 4.7,
    reviewCount: 76,
    featured: false,
    vendorName: 'Royal Palm Convention Centre',
    phone: '+91 98950 88990',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Conveniently situated in Calicut city centre with opulent stage rigging, modern culinary service quarters, and a warm wooden acoustic interior.',
    features: ['Acoustic Ceiling Panels', 'Separate Veg / Non-Veg Kitchens', '500+ Car Parking', 'Central Air Conditioning']
  },
  {
    serviceName: 'Malabar Dum Biryani & Mughal Banquets',
    category: 'catering',
    categoryLabel: 'Catering Service',
    district: 'Kozhikode',
    city: 'Kozhikode',
    location: 'Beach Road, Kozhikode',
    address: 'Near Corporation Stadium, Beach Road, Kozhikode, Kerala 673001',
    price: 550,
    priceType: 'per-person',
    priceUnit: 'per plate',
    guestCapacity: 800,
    rating: 4.8,
    reviewCount: 185,
    featured: true,
    vendorName: 'Royal Palm Convention Centre',
    phone: '+91 98460 77889',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Famous Thalassery & Kozhikodan dum biryani prepared with fragrant Jeerakasala rice, tender Malabar mutton, sulaimani tea bar, live pathiri stations, and decadent desserts.',
    features: ['Dum Biryani on Firewood', 'Live Soft Ari Pathiri Counter', 'Fresh Malabar Seafood Starters', 'Traditional Sulaimani Tea Bar']
  },

  // ── 4. THRISSUR ──────────────────────────────────────────────────────────
  {
    serviceName: 'Sobha City Mirage Convention Hall',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    district: 'Thrissur',
    city: 'Thrissur',
    location: 'Puzhakkal, Thrissur',
    address: 'Sobha City, Puzhakkal, Thrissur, Kerala 680553',
    price: 160000,
    priceType: 'per-event',
    priceUnit: 'per day',
    guestCapacity: 1800,
    rating: 4.9,
    reviewCount: 114,
    featured: true,
    vendorName: 'Bolgatty Hospitality Group',
    phone: '+91 94470 66778',
    image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Located next to Thrissur’s premier lakeside complex, offering a majestic venue with crystal fixtures, grand red-carpet entryway and scenic lake views.',
    features: ['Lakefront Promenade', 'State-of-the-art DMX Stage Lighting', 'Multi-story Covered Parking', 'Dedicated Catering Elevators']
  },
  {
    serviceName: 'Vedic Blooms & Traditional Stagecraft',
    category: 'decoration',
    categoryLabel: 'Stage & Floral Decor',
    district: 'Thrissur',
    city: 'Thrissur',
    location: 'Swaraj Round, Thrissur',
    address: 'East Fort Gate, Swaraj Round, Thrissur, Kerala 680005',
    price: 65000,
    priceType: 'per-event',
    priceUnit: 'starting price',
    guestCapacity: 0,
    rating: 4.7,
    reviewCount: 88,
    featured: false,
    vendorName: 'Mayflower Decorators',
    phone: '+91 94470 55667',
    image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Specialists in classic Kerala temple wedding aesthetics featuring hand-carved brass nilavilakku lamps, fresh chethi, mulla and marigold installations.',
    features: ['Brass Nilavilakku & Uruli Setup', 'Fresh Jasmine & Marigold Backdrop', 'Kolam & Pookkalam Floor Art', 'Pathway Lanterns']
  },

  // ── 5. KOTTAYAM ──────────────────────────────────────────────────────────
  {
    serviceName: 'Windsor Castle Grand Ballroom & Lakeside Lawns',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    district: 'Kottayam',
    city: 'Kottayam',
    location: 'Kodimatha, Kottayam',
    address: 'M.C. Road, Kodimatha, Kottayam, Kerala 686039',
    price: 135000,
    priceType: 'per-event',
    priceUnit: 'per day',
    guestCapacity: 1000,
    rating: 4.8,
    reviewCount: 82,
    featured: true,
    vendorName: 'Bolgatty Hospitality Group',
    phone: '+91 94470 44556',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545232979-fbf87595b3b5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Premier heritage hotel and convention venue on M.C. Road featuring picturesque backwater lawns and an opulent crystal-lit banquet ballroom.',
    features: ['Open-Air Lakeside Lawn', 'Centralized Air Conditioning', 'Ample Parking for 400 Cars', 'Luxury Bridal Suite']
  },
  {
    serviceName: 'Meenachil Luxury Event Planners & Stylists',
    category: 'event-management',
    categoryLabel: 'Event Management',
    district: 'Kottayam',
    city: 'Kottayam',
    location: 'Kanjikuzhy, Kottayam',
    address: 'Kanjikuzhy, Kottayam, Kerala 686004',
    price: 120000,
    priceType: 'per-event',
    priceUnit: 'planning fee',
    guestCapacity: 0,
    rating: 4.9,
    reviewCount: 65,
    featured: false,
    vendorName: 'Unicorn Events Kerala',
    phone: '+91 94470 33445',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Central Travancore event coordination experts specializing in luxury church weddings, riverside receptions, and customized themed celebrations.',
    features: ['Church & Hall Coordination', 'Custom Themed Styling', 'Guest Transport Management', 'Day-of Logistics Concierge']
  },

  // ── 6. ALAPPUZHA ──────────────────────────────────────────────────────────
  {
    serviceName: 'Lake Palace Backwater Pavilion & Convention',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    district: 'Alappuzha',
    city: 'Alappuzha',
    location: 'Thirumala, Alappuzha',
    address: 'Thirumala Ward, Alappuzha, Kerala 688011',
    price: 145000,
    priceType: 'per-event',
    priceUnit: 'per day',
    guestCapacity: 800,
    rating: 4.9,
    reviewCount: 94,
    featured: true,
    vendorName: 'Bolgatty Hospitality Group',
    phone: '+91 98470 22334',
    image: 'https://images.unsplash.com/photo-1545232979-fbf87595b3b5?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1545232979-fbf87595b3b5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Breathtaking waterfront destination venue nestled on the Vembanad Lake banks. Ideal for sunset receptions and houseboat wedding arrivals.',
    features: ['Vembanad Waterfront Deck', 'Houseboat Arrival Jetty', 'Sunset Amphitheatre', 'A/C Indoor Hall']
  },
  {
    serviceName: 'Kuttanad Coastal Feasts & Karimeen Specialties',
    category: 'catering',
    categoryLabel: 'Catering Service',
    district: 'Alappuzha',
    city: 'Alappuzha',
    location: 'Punnamada, Alappuzha',
    address: 'Punnamada Finishing Point, Alappuzha, Kerala 688006',
    price: 500,
    priceType: 'per-person',
    priceUnit: 'per plate',
    guestCapacity: 500,
    rating: 4.8,
    reviewCount: 104,
    featured: false,
    vendorName: 'Annapoorna Caterers & Banquets',
    phone: '+91 98470 11225',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Renowned backwater culinary catering featuring Karimeen Pollichathu, duck roast, coastal fish curry, and traditional dessert bars for memorable feasts.',
    features: ['Signature Karimeen Pollichathu', 'Kuttanadan Duck Mappas', 'Live Toddy Shop Style Counters', 'Palada Payasam']
  },

  // ── 7. PALAKKAD ──────────────────────────────────────────────────────────
  {
    serviceName: 'Fort Palace Heritage Convention Centre',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    district: 'Palakkad',
    city: 'Palakkad',
    location: 'Near Tipu Fort, Palakkad',
    address: 'Fort Road, Palakkad, Kerala 678001',
    price: 110000,
    priceType: 'per-event',
    priceUnit: 'per day',
    guestCapacity: 950,
    rating: 4.7,
    reviewCount: 58,
    featured: false,
    vendorName: 'Bolgatty Hospitality Group',
    phone: '+91 94460 99881',
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Heritage convention centre situated near Palakkad Fort, featuring traditional granite columns, spacious open lawn, and air-conditioned banquet facilities.',
    features: ['Granite Heritage Architecture', 'Capacity up to 950 Guests', 'Spacious Traditional Dining Area', 'Full Generator Backup']
  },
  {
    serviceName: 'Palakkad Traditional Brahmin Samayal Feasts',
    category: 'catering',
    categoryLabel: 'Catering Service',
    district: 'Palakkad',
    city: 'Palakkad',
    location: 'Kalpathy, Palakkad',
    address: 'Heritage Village, Kalpathy, Palakkad, Kerala 678003',
    price: 420,
    priceType: 'per-person',
    priceUnit: 'per plate',
    guestCapacity: 1000,
    rating: 4.9,
    reviewCount: 115,
    featured: true,
    vendorName: 'Annapoorna Caterers & Banquets',
    phone: '+91 94460 88772',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Kalpathy Agraharam specialty chefs offering traditional pure vegetarian wedding samayal with authentic morkozhambu, elissery, and hot parippu payasam.',
    features: ['Traditional Agraharam Samayal', 'Live Dosa & Idiyappam Station', 'Parippu & Ada Pradhaman', 'Strict Hygienic Standards']
  },

  // ── 8. MALAPPURAM ──────────────────────────────────────────────────────────
  {
    serviceName: 'Grand Regency Convention Hall & Lawns',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    district: 'Malappuram',
    city: 'Perinthalmanna',
    location: 'Ooty Road, Perinthalmanna',
    address: 'Ooty Road, Perinthalmanna, Malappuram, Kerala 679322',
    price: 155000,
    priceType: 'per-event',
    priceUnit: 'per day',
    guestCapacity: 1600,
    rating: 4.8,
    reviewCount: 90,
    featured: true,
    vendorName: 'Royal Palm Convention Centre',
    phone: '+91 98950 11224',
    image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'One of Malappuram district’s largest air-conditioned convention venues featuring a huge 1,600-capacity auditorium, separate royal dining hall, and valet parking.',
    features: ['1,600 Guest Main Hall', 'Separate 700-seat Dining', 'Large Stage Rigging', '600+ Car Parking']
  },
  {
    serviceName: 'Nilambur Royal Wedding & Stage Coordinators',
    category: 'event-management',
    categoryLabel: 'Event Management',
    district: 'Malappuram',
    city: 'Kottakkal',
    location: 'Changuvetty, Kottakkal',
    address: 'Changuvetty Junction, Kottakkal, Malappuram, Kerala 676503',
    price: 130000,
    priceType: 'per-event',
    priceUnit: 'planning fee',
    guestCapacity: 0,
    rating: 4.7,
    reviewCount: 62,
    featured: false,
    vendorName: 'Unicorn Events Kerala',
    phone: '+91 98950 22335',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Specialists in Malabar wedding logistics, royal stage decors, live Qawwali & Sufi artists, and flawless guest hospitality.',
    features: ['Malabar Nikah Management', 'Sufi & Ghazal Bands', 'Royal Stage Architecture', 'VIP Hospitality Staff']
  },

  // ── 9. KANNUR ──────────────────────────────────────────────────────────
  {
    serviceName: 'Payyambalam Beachside Convention Pavilion',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    district: 'Kannur',
    city: 'Kannur',
    location: 'Payyambalam Beach Road',
    address: 'Beach Road, Payyambalam, Kannur, Kerala 670001',
    price: 130000,
    priceType: 'per-event',
    priceUnit: 'per day',
    guestCapacity: 1100,
    rating: 4.8,
    reviewCount: 71,
    featured: true,
    vendorName: 'Bolgatty Hospitality Group',
    phone: '+91 97440 99883',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545232979-fbf87595b3b5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Stunning seaside wedding destination overlooking the Arabian Sea, featuring lush open lawns, sunset breeze, and modern banquet infrastructure.',
    features: ['Arabian Sea Sunset Views', 'Beachfront Open Lawn', 'Central Air Conditioning', '400+ Car Parking']
  },
  {
    serviceName: 'Theyyam Valley Candid Photography & Films',
    category: 'photography',
    categoryLabel: 'Photography & Cinema',
    district: 'Kannur',
    city: 'Kannur',
    location: 'Thavakkara, Kannur',
    address: 'Fort Road, Thavakkara, Kannur, Kerala 670002',
    price: 75000,
    priceType: 'per-event',
    priceUnit: 'package',
    guestCapacity: 0,
    rating: 4.9,
    reviewCount: 84,
    featured: false,
    vendorName: 'Lumiere Wedding Stories',
    phone: '+91 97440 88774',
    image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'North Malabar cinematographers documenting rich cultural traditions, candid laughter, beachside pre-shoots, and 4K wedding films.',
    features: ['North Malabar Candid Specialists', 'Coastal Beach Pre-Shoots', 'Full HD Drone Coverage', 'Custom Leather Album']
  },

  // ── 10. KOLLAM ──────────────────────────────────────────────────────────
  {
    serviceName: 'Asramam Lake View Convention Centre',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    district: 'Kollam',
    city: 'Kollam',
    location: 'Asramam, Kollam',
    address: 'Asramam Link Road, Kollam, Kerala 691001',
    price: 135000,
    priceType: 'per-event',
    priceUnit: 'per day',
    guestCapacity: 1300,
    rating: 4.8,
    reviewCount: 79,
    featured: true,
    vendorName: 'Bolgatty Hospitality Group',
    phone: '+91 94470 12987',
    image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Overlooking the serene Ashtamudi backwaters, this convention centre offers a tranquil lakeside setting with modern column-free banquet facilities.',
    features: ['Ashtamudi Lake Views', 'Pillarless AC Auditorium', 'Valet Parking for 450 Cars', 'Bridal Dressing Rooms']
  },
  {
    serviceName: 'Quilon Cashew Coast Royal Caterers',
    category: 'catering',
    categoryLabel: 'Catering Service',
    district: 'Kollam',
    city: 'Kollam',
    location: 'Beach Road, Kollam',
    address: 'Beach Road, Kollam, Kerala 691006',
    price: 480,
    priceType: 'per-person',
    priceUnit: 'per plate',
    guestCapacity: 800,
    rating: 4.8,
    reviewCount: 96,
    featured: false,
    vendorName: 'Annapoorna Caterers & Banquets',
    phone: '+91 94470 23876',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Southern coastal feast specialists preparing signature Cashew Payasam, Travancore Fish Curry, appam counters, and royal multi-course banquets.',
    features: ['Signature Roasted Cashew Payasam', 'Travancore Style Sea Fish Curry', 'Live Counter Arrangements', 'Complete Cutlery & Service']
  },

  // ── 11. WAYANAD ──────────────────────────────────────────────────────────
  {
    serviceName: 'Vythiri Misty Hills Wedding Pavilion',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    district: 'Wayanad',
    city: 'Vythiri',
    location: 'Lakkidi Ghats, Vythiri',
    address: 'Vythiri, Wayanad, Kerala 673576',
    price: 120000,
    priceType: 'per-event',
    priceUnit: 'per day',
    guestCapacity: 600,
    rating: 4.9,
    reviewCount: 52,
    featured: true,
    vendorName: 'Bolgatty Hospitality Group',
    phone: '+91 98470 34765',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545232979-fbf87595b3b5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Enchanting highland wedding venue nestled in the misty Western Ghats, featuring open wooden decks, natural stream views, and fresh mountain air.',
    features: ['Western Ghats Mountain Panorama', 'Open-Air Wooden Deck', 'Eco-friendly Green Architecture', 'Resort Stay Available']
  },
  {
    serviceName: 'Green Valley Wildflower & Bamboo Decors',
    category: 'decoration',
    categoryLabel: 'Stage & Floral Decor',
    district: 'Wayanad',
    city: 'Kalpetta',
    location: 'Main Road, Kalpetta',
    address: 'Kalpetta, Wayanad, Kerala 673121',
    price: 58000,
    priceType: 'per-event',
    priceUnit: 'starting price',
    guestCapacity: 0,
    rating: 4.8,
    reviewCount: 44,
    featured: false,
    vendorName: 'Mayflower Decorators',
    phone: '+91 98470 45654',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Bespoke eco-conscious stage designers utilizing native orchids, bamboo arches, pine cones, and fairy lights for rustic mountain weddings.',
    features: ['Zero-Plastic Bamboo Mandapam', 'Native Orchid & Fern Installations', 'Rustic Fairy Light Walkway', 'Eco-friendly Materials']
  },

  // ── 12. IDUKKI ──────────────────────────────────────────────────────────
  {
    serviceName: 'Munnar Pine Valley Convention Resort',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    district: 'Idukki',
    city: 'Devikulam',
    location: 'Tea Garden Road, Munnar',
    address: 'Devikulam, Munnar, Idukki, Kerala 685613',
    price: 140000,
    priceType: 'per-event',
    priceUnit: 'per day',
    guestCapacity: 500,
    rating: 4.9,
    reviewCount: 47,
    featured: true,
    vendorName: 'Bolgatty Hospitality Group',
    phone: '+91 94460 56543',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Exquisite mountain destination wedding resort surrounded by sprawling green tea plantations and pine trees. Cool climate and unforgettable photo spots.',
    features: ['Tea Plantation Panoramic Views', 'Glasshouse A/C Hall', 'Outdoor Campfire Lawn', 'Cottages for 150 Guests']
  },
  {
    serviceName: 'High Range Candid Stories & Drone Reels',
    category: 'photography',
    categoryLabel: 'Photography & Cinema',
    district: 'Idukki',
    city: 'Thodupuzha',
    location: 'Mangattukavala, Thodupuzha',
    address: 'Thodupuzha, Idukki, Kerala 685584',
    price: 68000,
    priceType: 'per-event',
    priceUnit: 'package',
    guestCapacity: 0,
    rating: 4.8,
    reviewCount: 53,
    featured: false,
    vendorName: 'Lumiere Wedding Stories',
    phone: '+91 94460 67432',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Highland wedding photography specialists capturing stunning mist, golden hour tea garden portraits, drone aerial perspectives, and authentic emotion.',
    features: ['High Altitude Drone Specialists', 'Munnar Tea Plantation Pre-Shoots', 'Cinematic Wedding Highlight', 'High-Res Album']
  },

  // ── 13. PATHANAMTHITTA ──────────────────────────────────────────────────────────
  {
    serviceName: 'Sabari Grand Auditorium & Royal Banquets',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    district: 'Pathanamthitta',
    city: 'Adoor',
    location: 'Kayamkulam - Punalur Road, Adoor',
    address: 'Adoor, Pathanamthitta, Kerala 691523',
    price: 115000,
    priceType: 'per-event',
    priceUnit: 'per day',
    guestCapacity: 1250,
    rating: 4.7,
    reviewCount: 60,
    featured: false,
    vendorName: 'Bolgatty Hospitality Group',
    phone: '+91 97450 78321',
    image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Central Travancore auditorium equipped with centralized air conditioning, generous stage area, 500-vehicle parking, and separate dining facilities.',
    features: ['1,250 Capacity Main Auditorium', 'Air Conditioned Dining Hall', 'Spacious Stage with Green Rooms', 'Generous Parking Space']
  },
  {
    serviceName: 'Aranmula Heritage Bell Metal & Floral Stylists',
    category: 'decoration',
    categoryLabel: 'Stage & Floral Decor',
    district: 'Pathanamthitta',
    city: 'Aranmula',
    location: 'Temple Road, Aranmula',
    address: 'Aranmula, Pathanamthitta, Kerala 689533',
    price: 62000,
    priceType: 'per-event',
    priceUnit: 'starting price',
    guestCapacity: 0,
    rating: 4.8,
    reviewCount: 50,
    featured: false,
    vendorName: 'Mayflower Decorators',
    phone: '+91 97450 89210',
    image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Renowned for incorporating authentic Aranmula metal mirror motifs, traditional brass hanging lamps (Thookku Vilakku), and fresh temple lotus installations.',
    features: ['Aranmula Bell Metal Accent Designs', 'Fresh Temple Lotus & Jasmine Decor', 'Brass Hanging Lamps Setup', 'Traditional Welcome Arch']
  },

  // ── 14. KASARAGOD ──────────────────────────────────────────────────────────
  {
    serviceName: 'Bekal Fort View Grand Convention Centre',
    category: 'hall',
    categoryLabel: 'Wedding Hall',
    district: 'Kasaragod',
    city: 'Bekal',
    location: 'Near Bekal Fort, Pallikkara',
    address: 'Bekal, Kasaragod, Kerala 671318',
    price: 135000,
    priceType: 'per-event',
    priceUnit: 'per day',
    guestCapacity: 1400,
    rating: 4.8,
    reviewCount: 68,
    featured: true,
    vendorName: 'Royal Palm Convention Centre',
    phone: '+91 98460 90109',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545232979-fbf87595b3b5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Scenic wedding venue perched near historic Bekal Fort, offering sweeping coastal views, grand air-conditioned ballrooms, and large outdoor lawns.',
    features: ['Bekal Fort Scenic Views', '1,400 Capacity Main Hall', 'Ocean Breeze Lawns', 'Helipad Access & Parking']
  },
  {
    serviceName: 'Chandragiri Destination Event Planners',
    category: 'event-management',
    categoryLabel: 'Event Management',
    district: 'Kasaragod',
    city: 'Kanhangad',
    location: 'Kotikulam, Kanhangad',
    address: 'Kanhangad, Kasaragod, Kerala 671315',
    price: 110000,
    priceType: 'per-event',
    priceUnit: 'planning fee',
    guestCapacity: 0,
    rating: 4.8,
    reviewCount: 46,
    featured: false,
    vendorName: 'Unicorn Events Kerala',
    phone: '+91 98460 01298',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'End-to-end wedding planners specializing in North Kerala destination weddings, beachside tents, cultural folk troupes, and guest accommodation.',
    features: ['Bekal Beach Weddings', 'Yaksha Gana & Oppana Performances', 'Luxury Guest Transportation', 'Vendor Coordination']
  }
];

export const seedAllDistricts = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wedplan';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
    console.log('[Seed Districts] Connected to MongoDB.');

    // 1. Find or create the primary approved demo vendor accounts
    // Find vendor user or fallback to first approved vendor
    let defaultVendorProfile = await VendorProfile.findOne({ verificationStatus: 'approved' });
    if (!defaultVendorProfile) {
      console.error('[Seed Districts] No approved vendor profile found. Run seed:demo first.');
      return;
    }

    const approvedProfiles = await VendorProfile.find({ verificationStatus: 'approved' });
    const profileMap = {};
    approvedProfiles.forEach((p) => {
      profileMap[p.businessName] = p;
    });

    console.log(`[Seed Districts] Found ${approvedProfiles.length} approved vendor profiles to associate.`);

    // 2. Remove ONLY previously seeded demo services (identified by isDemo: true)
    // Never delete real vendor services!
    const deleteResult = await Service.deleteMany({ isDemo: true });
    console.log(`[Seed Districts] Cleaned ${deleteResult.deletedCount} previous demo services.`);

    // 3. Insert each demo service
    let insertedCount = 0;
    for (const s of DEMO_SERVICES) {
      const assignedProfile = profileMap[s.vendorName] || defaultVendorProfile;
      const assignedUser = assignedProfile.user;

      await Service.create({
        vendor: assignedUser,
        vendorProfile: assignedProfile._id,
        vendorName: s.vendorName || assignedProfile.businessName,
        serviceName: s.serviceName,
        category: s.category.toLowerCase(),
        categoryLabel: s.categoryLabel,
        district: s.district,
        city: s.city,
        location: s.location,
        address: s.address,
        price: s.price,
        priceType: s.priceType,
        priceUnit: s.priceUnit,
        guestCapacity: s.guestCapacity,
        rating: s.rating,
        reviewCount: s.reviewCount,
        featured: s.featured,
        image: s.image,
        images: s.images,
        description: s.description,
        features: s.features,
        isActive: true,
        isDemo: true // Distinguishes demo from real vendor services
      });
      insertedCount++;
    }

    console.log(`[Seed Districts] Successfully seeded ${insertedCount} demo services across all 14 Kerala districts and 5 categories!`);
  } catch (error) {
    console.error('[Seed Districts Error]:', error);
  }
};

// Execute if run directly from CLI
if (process.argv[1] && process.argv[1].endsWith('seedAllDistrictsServices.js')) {
  seedAllDistricts().then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
}

