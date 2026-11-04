import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ServiceProvider } from './context/ServiceContext';
import { BookingProvider } from './context/BookingContext';
import { VendorProvider } from './context/VendorContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import CustomerLayout from './layouts/CustomerLayout';
import VendorLayout from './layouts/VendorLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import RegisterPage from './pages/public/RegisterPage';
import LoginPage from './pages/public/LoginPage';
import ServicesPage from './pages/public/ServicesPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import HallsPage from './pages/public/HallsPage';
import HallDetailPage from './pages/public/HallDetailPage';
import CateringPage from './pages/public/CateringPage';
import DecorationPage from './pages/public/DecorationPage';
import PhotographyPage from './pages/public/PhotographyPage';
import EventManagementPage from './pages/public/EventManagementPage';
import PackagesPage from './pages/public/PackagesPage';
import PackageDetailPage from './pages/public/PackageDetailPage';
import BookingPage from './pages/public/BookingPage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerBookings from './pages/customer/CustomerBookings';
import CustomerProfile from './pages/customer/CustomerProfile';

// Vendor Pages
import VendorRegisterPage from './pages/vendor/VendorRegisterPage';
import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorServices from './pages/vendor/VendorServices';
import VendorServiceAddEdit from './pages/vendor/VendorServiceAddEdit';
import VendorPackages from './pages/vendor/VendorPackages';
import VendorBookings from './pages/vendor/VendorBookings';
import VendorProfile from './pages/vendor/VendorProfile';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVendors from './pages/admin/AdminVendors';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminServices from './pages/admin/AdminServices';
import AdminBookings from './pages/admin/AdminBookings';
import AdminSettings from './pages/admin/AdminSettings';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <VendorProvider>
          <ServiceProvider>
            <BookingProvider>
              <Routes>
                {/* Public Website Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/services/:id" element={<ServiceDetailPage />} />
                  <Route path="/halls" element={<HallsPage />} />
                  <Route path="/halls/:id" element={<ServiceDetailPage />} />
                  <Route path="/catering" element={<CateringPage />} />
                  <Route path="/decoration" element={<DecorationPage />} />
                  <Route path="/photography" element={<PhotographyPage />} />
                  <Route path="/event-management" element={<EventManagementPage />} />
                  <Route path="/packages" element={<PackagesPage />} />
                  <Route path="/packages/:id" element={<PackageDetailPage />} />
                  <Route path="/booking/:serviceId" element={<BookingPage />} />
                  <Route path="/vendor/register" element={<VendorRegisterPage />} />
                </Route>

                {/* Dedicated Admin Login */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Customer Dashboard Routes */}
                <Route
                  path="/customer"
                  element={
                    <ProtectedRoute allowedRoles={['customer']}>
                      <CustomerLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/customer/dashboard" replace />} />
                  <Route path="dashboard" element={<CustomerDashboard />} />
                  <Route path="bookings" element={<CustomerBookings />} />
                  <Route path="profile" element={<CustomerProfile />} />
                </Route>

                {/* Vendor Dashboard Routes */}
                <Route
                  path="/vendor"
                  element={
                    <ProtectedRoute allowedRoles={['vendor']}>
                      <VendorLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/vendor/dashboard" replace />} />
                  <Route path="dashboard" element={<VendorDashboard />} />
                  <Route path="services" element={<VendorServices />} />
                  <Route path="services/add" element={<VendorServiceAddEdit />} />
                  <Route path="services/edit/:id" element={<VendorServiceAddEdit />} />
                  <Route path="packages" element={<VendorPackages />} />
                  <Route path="bookings" element={<VendorBookings />} />
                  <Route path="profile" element={<VendorProfile />} />
                </Route>

                {/* Admin Dashboard Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="vendors" element={<AdminVendors />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* 404 Catch-All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BookingProvider>
          </ServiceProvider>
        </VendorProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

