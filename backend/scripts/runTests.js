import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = 'http://127.0.0.1:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('WEDPLAN BACKEND API AUTOMATED INTEGRATION TEST SUITE');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch('http://127.0.0.1:5000/health');
    const healthData = await healthRes.json();
    assert(healthData.status === 'healthy', 'Health Check endpoint returns healthy');

    // 2. Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@wedplan.com', password: 'admin123' })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginData.success === true, 'Admin login succeeded');
    const adminToken = adminLoginData.data.token;
    assert(adminLoginData.data.user.role === 'admin', 'Admin user role is verified');

    // 3. Customer Login
    const custLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'anjali@example.com', password: 'customer123' })
    });
    const custLoginData = await custLoginRes.json();
    assert(custLoginData.success === true, 'Customer login succeeded');
    const customerToken = custLoginData.data.token;
    const customerId = custLoginData.data.user._id;

    // 4. Vendor Login
    const vendorLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'bolgatty@wedplan.com', password: 'vendor123' })
    });
    const vendorLoginData = await vendorLoginRes.json();
    assert(vendorLoginData.success === true, 'Vendor login succeeded');
    const vendorToken = vendorLoginData.data.token;

    // 5. Customer Registration
    const testEmail = `test.user.${Date.now()}@example.com`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Kavya Madhavan',
        email: testEmail,
        phone: '+91 98471 99999',
        password: 'password123',
        role: 'customer'
      })
    });
    const regData = await regRes.json();
    assert(regData.success === true, 'New customer registration created');
    assert(regData.data.user.email === testEmail, 'Customer email verified in response');

    // 6. Security: Prevent Customer from accessing Admin Routes
    const unauthorizedRes = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    assert(unauthorizedRes.status === 403, 'Customer blocked from admin dashboard (403 Forbidden)');

    // 7. Admin Dashboard Stats
    const dashRes = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const dashData = await dashRes.json();
    assert(dashData.success === true, 'Admin dashboard stats retrieved');
    assert(dashData.data.totalCustomers >= 1, 'Admin stats report registered customers');
    assert(dashData.data.totalVendors >= 1, 'Admin stats report vendors count');

    // 8. Public Services Query with Filtering (District, Category, Price)
    const servicesRes = await fetch(`${BASE_URL}/services?category=hall&district=Ernakulam`);
    const servicesData = await servicesRes.json();
    assert(servicesData.success === true, 'Public services list query succeeded');
    assert(Array.isArray(servicesData.data), 'Services returned as array');
    const hallService = servicesData.data[0];
    assert(hallService !== undefined, 'Found active hall in Ernakulam');

    // 9. Customer Booking Submission
    const testDate = '2027-02-20';
    const bookRes = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        serviceId: hallService._id,
        eventType: 'Wedding Ceremony',
        eventDate: testDate,
        eventTime: '09:30 AM (Muhurtham)',
        guestCount: 500,
        location: 'Bolgatty Island, Kochi',
        requirements: 'Front row seating for VIPs'
      })
    });
    const bookData = await bookRes.json();
    assert(bookData.success === true, 'Customer booking created with status pending');
    const createdBooking = bookData.data;
    assert(createdBooking.status === 'pending', 'Booking initialized with status pending');

    // 10. Vendor View Bookings
    const vendorBookingsRes = await fetch(`${BASE_URL}/vendors/bookings`, {
      headers: { Authorization: `Bearer ${vendorToken}` }
    });
    const vendorBookingsData = await vendorBookingsRes.json();
    assert(vendorBookingsData.success === true, 'Vendor retrieved booking inquiries');

    // 11. Vendor Accepts Booking
    const acceptRes = await fetch(`${BASE_URL}/vendors/bookings/${createdBooking._id}/accept`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vendorToken}`
      },
      body: JSON.stringify({ vendorResponse: 'Gladly accepted!' })
    });
    const acceptData = await acceptRes.json();
    assert(acceptData.success === true, 'Vendor confirmed first booking');
    assert(acceptData.data.status === 'confirmed', 'Booking status is now confirmed');

    // 12. CRITICAL TEST: Conflict Prevention on Same Hall and Same Date
    // Customer 2 tries to book the same hall on the same confirmed date (2027-02-20)
    const conflictBookingRes = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        serviceId: hallService._id,
        eventType: 'Wedding Reception',
        eventDate: testDate,
        guestCount: 300,
        location: 'Bolgatty Island, Kochi'
      })
    });
    const conflictBookingData = await conflictBookingRes.json();
    assert(
      conflictBookingRes.status === 409 || conflictBookingData.success === false,
      'Double-booking conflict prevented on same hall and same date'
    );

    // 13. Customer Cancels Booking
    const cancelRes = await fetch(`${BASE_URL}/bookings/${createdBooking._id}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify({ reason: 'Family decided on alternative venue' })
    });
    const cancelData = await cancelRes.json();
    assert(cancelData.success === true, 'Customer cancelled booking');
    assert(cancelData.data.status === 'cancelled', 'Booking marked as cancelled');

    // 14. Admin Vendor Approval Workflow
    const pendingVendorsRes = await fetch(`${BASE_URL}/admin/vendors/pending`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const pendingVendorsData = await pendingVendorsRes.json();
    assert(pendingVendorsData.success === true, 'Admin retrieved pending vendor applications');

    if (pendingVendorsData.data.length > 0) {
      const targetVendor = pendingVendorsData.data[0];
      const approveRes = await fetch(`${BASE_URL}/admin/vendors/${targetVendor._id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const approveData = await approveRes.json();
      assert(approveData.success === true, `Admin approved vendor '${targetVendor.businessName}'`);
      assert(approveData.data.verificationStatus === 'approved', 'Vendor status updated to approved');
    }

    console.log('====================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

// Start backend server in-process if not already running, then execute tests
import('../server.js').then(() => {
  setTimeout(runTests, 1500);
});

