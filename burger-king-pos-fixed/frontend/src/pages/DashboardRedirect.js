import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import AdminDashboard from './AdminDashboard';
import KitchenDisplayPage from './KitchenDisplayPage';
import POSPage from './POSPage';

/**
 * DashboardRedirect
 * 
 * Intercepts the /profile or /dashboard route and redirects the user
 * to their specific interface based on their account role (admin, staff, customer).
 */
export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bk-dark flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-bk-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-bk-gold font-heading font-black uppercase tracking-widest tracking-tighter">Syncing Profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Simple mapping based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'staff':
      // Staff defaults to Kitchen or POS depending on preference, here we'll use POS
      return <POSPage />;
    case 'customer':
    default:
      return <CustomerDashboard />;
  }
}
