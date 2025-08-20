import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useSocket } from '../../hooks/useSocket';

const Layout: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Initialize socket connection
  useSocket(user?.id || null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;