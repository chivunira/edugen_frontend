// src/components/layout/DashboardLayout/DashboardLayout.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayoutProps } from './types';
import { navItems } from './navItems';
import UserAvatar from "../../common/UserAvatar.tsx";
import Logo from "../../common/Logo.tsx";

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  userName = "Student Name",
  userGrade = "Grade",
  user
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center">
            <Logo />
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md lg:hidden hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 pt-4">
          {navItems.map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => navigate(item.path)}
                className={`flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-colors duration-200 ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-blue-50 text-primary'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.title}</span>
              </button>
            </motion.div>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 ${isOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        {/* Top Header */}
        <header className="fixed top-0 right-0 z-20 flex items-center justify-between w-full h-16 px-6 bg-white shadow-sm">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md lg:hidden hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          
          {/* User Profile Section */}
          <div className="flex items-center ml-auto">
            <div className="mr-4 text-right">
              <p className="text-sm font-medium text-gray-800">{userName}</p>
              <p className="text-xs text-gray-500">{userGrade}</p>
            </div>
            <UserAvatar
              firstName={user?.firstName}
              lastName={user?.lastName}
              profilePhoto={user?.profile_photo}
              size="sm"
            />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="px-6 pt-24 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;