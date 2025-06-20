// Payment types and enums
export * from './payment';

// Session types and enums
export * from './session';

// Common types
export interface Client {
  id: string;
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface DashboardStats {
  totalClients: number;
  newClientsThisMonth: number;
  totalSessions: number;
  sessionsThisMonth: number;
  pendingSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  refundedSessions: number;
  totalRevenue: number;
  pendingAmount: number;
  deliveredPhotos: number;
  pendingPhotos: number;
}

export interface ApiResponse<T> {
  data: T;
} 