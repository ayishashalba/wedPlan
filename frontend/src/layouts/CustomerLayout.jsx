import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-wed-cream">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        <Sidebar role="customer" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerLayout;

