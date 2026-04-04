import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ServiceSelectionPage from './pages/ServiceSelectionPage';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmPage from './pages/OrderConfirmPage';
import { LoginPage, SignupPage, ForgotPasswordPage } from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import OffersPage from './pages/OffersPage';
import DineInPage from './pages/DineInPage';
import CustomerDashboard from './pages/CustomerDashboard';
import KitchenDisplayPage from './pages/KitchenDisplayPage';
import POSPage from './pages/POSPage';
import AdminDashboard from './pages/AdminDashboard';
import DashboardRedirect from './pages/DashboardRedirect';

function AppRoutes() {
  const { isDark } = useTheme();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#1A0F08' : '#FFF8E7',
            color: isDark ? '#FFF8E7' : '#2C1810',
            border: '1px solid #C8962A',
            fontFamily: 'Nunito, sans-serif',
          },
          success: { iconTheme: { primary: '#C8962A', secondary: isDark ? '#0D0805' : '#FFF8E7' } },
        }}
      />
      <Routes>
        {/* Service Selection - First Landing Page */}
        <Route path="/select-service" element={<ServiceSelectionPage />} />
        
        {/* Customer-facing routes */}
        <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
        <Route path="/menu" element={<><Navbar /><MenuPage /><Footer /></>} />
        <Route path="/cart" element={<><Navbar /><CartPage /><Footer /></>} />
        <Route path="/checkout" element={<><Navbar /><CheckoutPage /></>} />
        <Route path="/order-confirm/:orderId" element={<><Navbar /><OrderConfirmPage /></>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/profile" element={<><Navbar /><DashboardRedirect /><Footer /></>} />
        <Route path="/dashboard" element={<><Navbar /><DashboardRedirect /><Footer /></>} />
        <Route path="/offers" element={<><Navbar /><OffersPage /><Footer /></>} />
        <Route path="/dine-in" element={<><Navbar /><DineInPage /></>} />
        {/* Table QR scan route */}
        <Route path="/table/:token" element={<DineInPage />} />

        {/* Staff/POS routes */}
        <Route path="/pos" element={<POSPage />} />
        <Route path="/kitchen" element={<KitchenDisplayPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
