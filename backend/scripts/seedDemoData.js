import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import VendorProfile from '../models/VendorProfile.js';
import Service from '../models/Service.js';
import Package from '../models/Package.js';
import Booking from '../models/Booking.js';
import { seedAllDistricts } from './seedAllDistrictsServices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedDemoData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is not set in environment.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('[Seed Demo] Connected to MongoDB Atlas.');

    // Clear existing data for fresh seed
    await Promise.all([
      User.deleteMany({}),
      VendorProfile.deleteMany({}),
      Service.deleteMany({}),
      Package.deleteMany({}),
      Booking.deleteMany({})
    ]);
    console.log('[Seed Demo] Cleared previous database collections.');

    // 1. Seed Admin
    const admin = await User.create({
      name: 'WedPlan Administrator',
      email: 'admin@wedplan.com',
      phone: '+91 94000 00000',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });
    console.log('[Seed Demo] Admin seeded:', admin.email);

    // 2. Seed Customer
    const customer = await User.create({
      name: 'Anjali Menon',
      email: 'anjali@example.com',
      phone: '+91 98460 99887',
      password: 'customer123',
      role: 'customer',
      isActive: true
    });
    console.log('[Seed Demo] Customer seeded:', customer.email);

    const customer2 = await User.create({
      name: 'Dr. Vivek Kurian',
      email: 'vivek.kurian@example.com',
      phone: '+91 94470 55443',
      password: 'customer123',
      role: 'customer',
      isActive: true
    });

    // 3. Seed Vendor 1: Bolgatty Hospitality Group (Approved)
    const vendor1User = await User.create({
      name: 'Mathew Varghese',
      email: 'bolgatty@wedplan.com',
      phone: '+91 98470 12345',
      password: 'vendor123',
      role: 'vendor',
      isActive: true
    });

    const vendor1Profile = await VendorProfile.create({
      user: vendor1User._id,
      businessName: 'Bolgatty Hospitality Group',
      ownerName: 'Mathew Varghese',
      category: 'Wedding Hall',
      email: 'bolgatty@wedplan.com',
      phone: '+91 98470 12345',
      district: 'Ernakulam',
      city: 'Kochi',
      address: 'Bolgatty Island, Mulavukad, Kochi, Kerala 682504',
      experience: 18,
      logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80',
      description: 'Premier heritage hospitality provider offering iconic waterfront destination wedding venues across central Kerala.',
      verificationStatus: 'approved',
      approvedAt: new Date('2025-01-15')
    });

    // Vendor 2: Annapoorna Caterers (Approved)
    const vendor2User = await User.create({
      name: 'Suresh Kumar',
      email: 'annapoorna@wedplan.com',
      phone: '+91 94471 23456',
      password: 'vendor123',
      role: 'vendor',
      isActive: true
    });

    const vendor2Profile = await VendorProfile.create({
      user: vendor2User._id,
      businessName: 'Annapoorna Caterers & Banquets',
      ownerName: 'Suresh Kumar',
      category: 'Catering',
      email: 'annapoorna@wedplan.com',
      phone: '+91 94471 23456',
      district: 'Ernakulam',
      city: 'Kochi',
      address: 'Panampilly Nagar, Kochi, Kerala 682036',
      experience: 22,
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
      description: 'Masters of authentic Kerala Sadya and royal wedding feasts catering to over 5,000 weddings since 2002.',
      verificationStatus: 'approved',
      approvedAt: new Date('2025-02-01')
    });

    // Vendor 3: Lumiere Wedding Stories (Approved)
    const vendor3User = await User.create({
      name: 'Akhil & Neha Menon',
      email: 'lumiere@wedplan.com',
      phone: '+91 97452 34567',
      password: 'vendor123',
      role: 'vendor',
      isActive: true
    });

    const vendor3Profile = await VendorProfile.create({
      user: vendor3User._id,
      businessName: 'Lumiere Wedding Stories',
      ownerName: 'Akhil & Neha Menon',
      category: 'Photography',
      email: 'lumiere@wedplan.com',
      phone: '+91 97452 34567',
      district: 'Ernakulam',
      city: 'Kochi',
      address: 'Ravipuram, M.G Road, Kochi, Kerala 682016',
      experience: 10,
      logo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&q=80',
      description: 'Top-tier candid cinematography and storytelling agency working across Kochi, Trivandrum, and destination weddings.',
      verificationStatus: 'approved',
      approvedAt: new Date('2025-02-10')
    });

    // Vendor 4: Royal Palm Convention Centre (Pending Verification)
    const vendor4User = await User.create({
      name: 'Faisal Mohammed',
      email: 'faisal.royalpalm@gmail.com',
      phone: '+91 98950 88990',
      password: 'vendor123',
      role: 'vendor',
      isActive: true
    });

    await VendorProfile.create({
      user: vendor4User._id,
      businessName: 'Royal Palm Convention Centre',
      ownerName: 'Faisal Mohammed',
      category: 'Wedding Hall',
      email: 'faisal.royalpalm@gmail.com',
      phone: '+91 98950 88990',
      district: 'Kozhikode',
      city: 'Kozhikode',
      address: 'Kallai Road, Kozhikode, Kerala 673003',
      experience: 4,
      logo: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=200&q=80',
      description: 'Newly constructed 2500-capacity air conditioned convention hall awaiting trade verification.',
      verificationStatus: 'pending'
    });

    // 4. Seed Services for approved vendors
    const hallService1 = await Service.create({
      vendor: vendor1User._id,
      vendorProfile: vendor1Profile._id,
      vendorName: 'Bolgatty Hospitality Group',
      serviceName: 'Bolgatty Palace & Island Convention Centre',
      category: 'hall',
      categoryLabel: 'Wedding Hall',
      district: 'Ernakulam',
      city: 'Kochi',
      location: 'Mulavukad, Kochi',
      address: 'Bolgatty Island, Mulavukad, Kochi, Kerala 682504',
      price: 185000,
      priceType: 'per-event',
      priceUnit: 'per day',
      guestCapacity: 1500,
      rating: 4.9,
      reviewCount: 142,
      featured: true,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1545232979-fbf87595b3b5?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Set amidst picturesque backwaters on Bolgatty Island, this heritage venue blends royal Dutch architecture with sprawling waterfront lawns and an air-conditioned banquet hall.',
      features: [
        'Centralized Air Conditioning',
        'Sprawling Waterfront Lawns',
        'Dedicated Bridal Suites & Green Rooms',
        'Valet Parking for 500+ Vehicles',
        'In-house Genset Power Backup (100%)'
      ],
      isActive: true
    });

    const hallService2 = await Service.create({
      vendor: vendor1User._id,
      vendorProfile: vendor1Profile._id,
      vendorName: 'Bolgatty Hospitality Group',
      serviceName: 'Al Saj Convention Centre & Royale Banquets',
      category: 'hall',
      categoryLabel: 'Wedding Hall',
      district: 'Thiruvananthapuram',
      city: 'Thiruvananthapuram',
      location: 'Kazhakkoottam, Thiruvananthapuram',
      address: 'NH 66 Bypass, Kazhakkoottam, Thiruvananthapuram, Kerala 695582',
      price: 140000,
      priceType: 'per-event',
      priceUnit: 'per day',
      guestCapacity: 2200,
      rating: 4.8,
      reviewCount: 98,
      featured: true,
      image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'South Kerala’s most renowned luxury banquet destination featuring column-free pillarless halls and acoustic sound engineering.',
      features: [
        'Pillarless Grand Ballroom',
        'Seating for 2,200 Guests',
        'High Speed WiFi & AV Console',
        'Massive Dining Hall with 800 seats'
      ],
      isActive: true
    });

    const cateringService = await Service.create({
      vendor: vendor2User._id,
      vendorProfile: vendor2Profile._id,
      vendorName: 'Annapoorna Caterers & Banquets',
      serviceName: 'Annapoorna Royal Kerala Sadya',
      category: 'catering',
      categoryLabel: 'Catering',
      district: 'Ernakulam',
      city: 'Kochi',
      location: 'Panampilly Nagar, Kochi',
      address: 'Panampilly Nagar, Kochi, Kerala 682036',
      price: 450,
      priceType: 'per-person',
      priceUnit: 'per plate',
      guestCapacity: 1200,
      rating: 4.9,
      reviewCount: 180,
      featured: true,
      image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Authentic 28-dish traditional Kerala sadya served on plantain leaves with hot Ada Pradhaman, Paalada, and Parippu Payasam.',
      features: [
        '28 Authentic Traditional Dishes',
        '3 Varieties of Hot Payasam',
        'Eco-friendly Banana Leaf Service',
        'Uniformed Service Crew'
      ],
      isActive: true
    });

    const photoService = await Service.create({
      vendor: vendor3User._id,
      vendorProfile: vendor3Profile._id,
      vendorName: 'Lumiere Wedding Stories',
      serviceName: 'Lumiere Candid Cinema 2-Day Package',
      category: 'photography',
      categoryLabel: 'Photography',
      district: 'Ernakulam',
      city: 'Kochi',
      location: 'Ravipuram, M.G Road, Kochi',
      address: 'Ravipuram, M.G Road, Kochi, Kerala 682016',
      price: 90000,
      priceType: 'per-event',
      priceUnit: 'per package',
      guestCapacity: 0,
      rating: 5.0,
      reviewCount: 95,
      featured: true,
      image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Complete 2-day candid wedding film and photo coverage with licensed drone cinematographers and 4K teasers.',
      features: [
        '4K Cinematic Teaser within 72 Hours',
        'Licensed 4K Drone Aerial Footage',
        'Premium Leatherbound Coffee Table Book',
        'Full Raw Footage Drive'
      ],
      isActive: true
    });

    // 5. Seed Curated Package
    await Package.create({
      vendor: vendor1User._id,
      packageName: 'The Royal Travancore Grand Wedding Package',
      tagline: 'Complete 360-degree luxury celebration for up to 800 guests',
      price: 499000,
      discountPrice: 449000,
      duration: '2 Days (Engagement + Wedding / Reception)',
      district: 'Ernakulam',
      rating: 4.9,
      reviewCount: 54,
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'Our most sought-after royal bundle combining luxury venue, traditional 28-dish feast, lavish floral mandapam, 4K candid cinema, and day-of concierge support.',
      includedServices: [
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
      featured: true,
      isActive: true
    });

    // 6. Seed Sample Bookings
    await Booking.create({
      bookingId: 'BK-78901',
      customer: customer._id,
      vendor: vendor1User._id,
      service: hallService1._id,
      serviceName: 'Bolgatty Palace & Island Convention Centre',
      serviceCategory: 'hall',
      vendorName: 'Bolgatty Hospitality Group',
      customerName: 'Anjali Menon',
      customerEmail: 'anjali@example.com',
      customerPhone: '+91 98460 99887',
      eventType: 'Wedding Ceremony & Reception',
      eventDate: '2026-12-18',
      eventTime: '09:30 AM',
      guestCount: 850,
      eventLocation: 'Bolgatty Island, Kochi',
      requirements: 'Need early morning access for stage setup from 4:00 AM. Extra parking attendants requested.',
      totalAmount: 185000,
      status: 'confirmed',
      vendorResponse: 'Accepted. Date reserved for wedding ceremony.'
    });

    await Booking.create({
      bookingId: 'BK-78902',
      customer: customer._id,
      vendor: vendor2User._id,
      service: cateringService._id,
      serviceName: 'Annapoorna Royal Kerala Sadya',
      serviceCategory: 'catering',
      vendorName: 'Annapoorna Caterers & Banquets',
      customerName: 'Anjali Menon',
      customerEmail: 'anjali@example.com',
      customerPhone: '+91 98460 99887',
      eventType: 'Wedding Sadya',
      eventDate: '2026-12-18',
      eventTime: '12:00 PM',
      guestCount: 850,
      eventLocation: 'Bolgatty Island Dining Hall, Kochi',
      requirements: 'Extra Ada Pradhaman counter. Strict hygienic food safety gear for all service staff.',
      totalAmount: 382500,
      status: 'pending'
    });

    await Booking.create({
      bookingId: 'BK-78903',
      customer: customer2._id,
      vendor: vendor3User._id,
      service: photoService._id,
      serviceName: 'Lumiere Candid Cinema 2-Day Package',
      serviceCategory: 'photography',
      vendorName: 'Lumiere Wedding Stories',
      customerName: 'Dr. Vivek Kurian',
      customerEmail: 'vivek.kurian@example.com',
      customerPhone: '+91 94470 55443',
      eventType: 'Engagement & Wedding',
      eventDate: '2027-01-10',
      eventTime: 'Full Day',
      guestCount: 500,
      eventLocation: 'Windsor Castle, Kottayam',
      requirements: 'Drone flight clearance for church grounds arranged.',
      totalAmount: 90000,
      status: 'confirmed',
      vendorResponse: 'Confirmed. Cinematography team scheduled.'
    });

    console.log('[Seed Demo] Demo dataset seeded successfully with Kerala vendors, venues, packages, and bookings!');
    await seedAllDistricts();
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Demo Error]:', error);
    process.exit(1);
  }
};

seedDemoData();
