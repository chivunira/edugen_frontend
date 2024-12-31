// src/components/layout/DashboardLayout/types.ts

import { ReactNode } from 'react';
import {User} from "../../../types/auth.ts";

export interface DashboardLayoutProps {
  children: ReactNode;
  userName?: string;
  userGrade?: string;
  user?:User
}

export interface NavItem {
  title: string;
  path: string;
  icon: ReactNode;
}