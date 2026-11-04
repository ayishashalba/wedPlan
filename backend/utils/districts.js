export const KERALA_DISTRICTS = [
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Ernakulam',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod'
];

// Helper to normalize district strings (e.g., 'Ernakulam (Kochi)' -> 'Ernakulam')
export const normalizeDistrict = (district) => {
  if (!district) return '';
  const cleaned = district.split('(')[0].trim();
  const found = KERALA_DISTRICTS.find(
    (d) => d.toLowerCase() === cleaned.toLowerCase()
  );
  return found || district;
};

