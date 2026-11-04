export const KERALA_DISTRICTS = [
  'Ernakulam (Kochi)',
  'Thiruvananthapuram',
  'Kozhikode',
  'Thrissur',
  'Kottayam',
  'Alappuzha',
  'Palakkad',
  'Malappuram',
  'Kannur',
  'Kollam',
  'Wayanad',
  'Idukki',
  'Pathanamthitta',
  'Kasaragod'
];

export const SERVICE_CATEGORIES = [
  { id: 'hall', label: 'Wedding Halls & Convention Centres', path: '/halls', icon: 'Building2' },
  { id: 'catering', label: 'Catering Services', path: '/catering', icon: 'Utensils' },
  { id: 'decoration', label: 'Stage & Floral Decoration', path: '/decoration', icon: 'Sparkles' },
  { id: 'photography', label: 'Photography & Videography', path: '/photography', icon: 'Camera' },
  { id: 'event-management', label: 'Event Management', path: '/event-management', icon: 'CalendarHeart' }
];

export const EVENT_TYPES = [
  'Wedding Ceremony',
  'Engagement',
  'Reception',
  'Sangeet / Mehendi',
  'Haldi Ceremony',
  'Baptism / Naming Ceremony',
  'Anniversary / Birthday',
  'Corporate Gala'
];

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

