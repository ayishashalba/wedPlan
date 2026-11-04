# WedPlan – Multi-Vendor Kerala Wedding & Event Platform (Frontend)

WedPlan is a modern, luxury wedding and event booking platform tailored for Kerala, India. It connects couples with premier convention centres, authentic Sadya caterers, stage artisans, and candid cinematographers across all 14 districts.

---

## 🎨 Luxury Theme & Design System

The application is styled with a bespoke Kerala wedding palette using **Tailwind CSS**:
- **Primary / Warm Ivory**: `#FFFDF8` (`bg-wed-ivory`)
- **Secondary / Champagne Gold**: `#C5A46D` (`text-wed-gold`, `bg-wed-gold`)
- **Background / Cream**: `#F8F4EC` (`bg-wed-cream`)
- **Text / Dark Brown**: `#352D28` (`text-wed-brown`)
- **Accent / Soft Blush**: `#EAD5D0` (`bg-wed-blush`)
- **Typography**: `Playfair Display` (Serif headings) & `Plus Jakarta Sans` (UI body)

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🔑 Demo Personas & One-Click Switcher

For seamless portfolio review and interview demonstration, the application includes a **Top Demo Persona Switcher** and pre-filled login credentials:

| Persona | Email | Password | Role | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | `anjali@example.com` | `customer123` | Customer | Browse services, submit booking inquiries, view & cancel bookings, profile management |
| **Vendor** | `bolgatty@wedplan.com` | `vendor123` | Vendor | Manage listings (add/edit/delete), review booking inquiries (accept/reject/complete), business profile |
| **Admin** | `admin@wedplan.com` | `admin123` | Admin | Review pending vendor trade registrations, verify/reject vendors, activate/deactivate customers, moderate listings, master booking ledger |

---

## 📂 Project Architecture

```
src/
├── assets/                 # Brand assets & graphics
├── components/             # Reusable UI components
│   ├── BookingCard.jsx     # Booking request card with details modal & status actions
│   ├── ConfirmationDialog.jsx # Confirmation modal for deletions/cancellations
│   ├── EmptyState.jsx      # Empty state indicators with actionable CTAs
│   ├── FilterPanel.jsx     # Category, district, price & capacity filter drawer
│   ├── Footer.jsx          # Kerala wedding footer with district directory
│   ├── HallCard.jsx        # Hall card with capacity, facilities & price
│   ├── LoadingSpinner.jsx  # Champagne gold animated loading indicator
│   ├── Modal.jsx           # Accessible backdrop modal dialog
│   ├── Navbar.jsx          # Responsive header with quick role switcher & mobile drawer
│   ├── PackageCard.jsx     # All-in-one package bundle card
│   ├── ProtectedRoute.jsx  # Role-based route guard
│   ├── SearchBar.jsx       # Multi-parameter search (district, event, date, guests)
│   ├── ServiceCard.jsx     # Universal service card with responsive hover effects
│   ├── Sidebar.jsx         # Contextual sidebar for Customer, Vendor & Admin portals
│   ├── StatusBadge.jsx     # Color-coded verification & booking status badge
│   └── VendorCard.jsx      # Vendor profile preview card
├── context/                # Global state with React Context API
│   ├── AuthContext.jsx     # Authentication, role switching, user session
│   ├── BookingContext.jsx  # Booking creation, status updates & customer/vendor ledger
│   ├── ServiceContext.jsx  # Services, packages, category & district filtering
│   └── VendorContext.jsx   # Vendor registrations, approvals, rejections & customer status
├── layouts/                # Portal layouts
│   ├── AdminLayout.jsx     # Admin administration portal layout
│   ├── CustomerLayout.jsx  # Couple / Customer portal layout
│   ├── PublicLayout.jsx    # Public website layout with Navbar & Footer
│   └── VendorLayout.jsx    # Vendor management portal layout
├── pages/
│   ├── public/             # Public facing pages
│   │   ├── BookingPage.jsx         # Request booking for services/packages
│   │   ├── CateringPage.jsx        # Kerala Sadya & Dum Biryani caterers
│   │   ├── DecorationPage.jsx      # Stage, mandapam & floral artistry
│   │   ├── EventManagementPage.jsx # End-to-end wedding planners
│   │   ├── HallDetailPage.jsx      # Venue gallery, amenities, location & booking CTA
│   │   ├── HallsPage.jsx           # Convention centres & banquet halls
│   │   ├── HomePage.jsx            # Hero search, categories, packages, testimonials
│   │   ├── LoginPage.jsx           # Customer/vendor authentication
│   │   ├── PackageDetailPage.jsx   # Curated bundle inclusions & breakdown
│   │   ├── PackagesPage.jsx        # Combined wedding packages
│   │   ├── PhotographyPage.jsx     # Candid cinematography & drone studios
│   │   ├── RegisterPage.jsx        # Account registration with role selection
│   │   └── ServicesPage.jsx        # Full catalog with search & multi-attribute filters
│   ├── customer/           # Customer portal
│   │   ├── CustomerBookings.jsx    # Filterable booking history & cancellation
│   │   ├── CustomerDashboard.jsx   # Metrics, stats & recent booking activity
│   │   └── CustomerProfile.jsx     # Contact & Kerala district preferences
│   ├── vendor/             # Vendor portal
│   │   ├── VendorBookings.jsx      # Accept/reject/complete incoming customer requests
│   │   ├── VendorDashboard.jsx     # Service stats, earnings, verification banner
│   │   ├── VendorPackages.jsx      # View inclusion in bundled wedding packages
│   │   ├── VendorProfile.jsx       # Business details, address, licensing status
│   │   ├── VendorRegisterPage.jsx  # Detailed onboarding form (Pending verification)
│   │   ├── VendorServiceAddEdit.jsx# Form to create/edit services with facilities & pricing
│   │   └── VendorServices.jsx      # Manage own listings with deletion dialogs
│   └── admin/              # Admin portal
│       ├── AdminBookings.jsx       # Full marketplace booking supervision
│       ├── AdminCustomers.jsx      # Search customers, toggle account status
│       ├── AdminDashboard.jsx      # Platform analytics, pending approvals table
│       ├── AdminLoginPage.jsx      # Dedicated administration portal login
│       ├── AdminServices.jsx       # Catalog oversight & content moderation
│       ├── AdminSettings.jsx       # Master credentials & policy settings
│       └── AdminVendors.jsx        # Approve/reject vendor onboarding requests
├── services/               # API service layer ready for future MERN integration
│   ├── api.js              # Axios instance with JWT interceptors & error handlers
│   ├── authService.js      # Authentication endpoints
│   ├── bookingService.js   # Booking API methods
│   ├── serviceService.js   # Service catalog CRUD
│   └── vendorService.js    # Vendor onboarding & status APIs
├── styles/
│   └── index.css           # Tailwind directives & luxury styling
├── utils/
│   ├── formatters.js       # INR currency formatting, dates & Kerala district list
│   └── mockData.js         # Realistic Kerala venues, caterers, decorators & photographers
├── App.jsx                 # Routing configuration with role-based protected routes
└── main.jsx                # Application entry point
```

---

## 🔌 Future MERN Backend Integration

The frontend is architected for zero-refactoring backend connection:
1. `src/services/api.js` is already pre-configured with `axios` baseURL (`import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`).
2. Authorization headers automatically attach JWT bearer tokens from `localStorage.getItem('wedplan_token')`.
3. Service files (`authService.js`, `bookingService.js`, `serviceService.js`, `vendorService.js`) encapsulate all REST endpoints.
4. Replace the demo localStorage fallback in the context providers with backend API calls when your Node/Express server is active.

