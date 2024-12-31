// src/pages/DashboardPage.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const DashboardPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  // Combine firstName and lastName for display
  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
    : "Student";

  return (
    <DashboardLayout
      userName={fullName}
      userGrade={user?.grade || "Grade"}
      user={user || undefined}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default DashboardPage;