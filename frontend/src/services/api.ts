import axios from 'axios';
import { DashboardStats, SessionFilters } from './interfaces';
import { 
  USE_MOCK_DATA, 
  mockClients, 
  mockSessions, 
  mockPayments, 
  mockDashboardStats 
} from './mockData';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3244';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type { DashboardStats };

export class ApiService {
  // Dashboard endpoints
  static async getDashboardStats(): Promise<DashboardStats> {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockDashboardStats;
    }
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  }

  static async getRecentClients() {
    const response = await api.get('/dashboard/recent-clients');
    return response.data;
  }

  static async getPendingPayments() {
    const response = await api.get('/dashboard/pending-payments');
    return response.data;
  }

  static async getUpcomingSessions() {
    const response = await api.get('/dashboard/upcoming-sessions');
    return response.data;
  }

  // Client endpoints
  static async getQuantityOfClients(): Promise<{ quantity: number }> {
    const response = await api.get<{ quantity: number }>('/clients/stats/quantity');
    return response.data;
  }

  static async getQuantityOfNewClientsThisMonth(): Promise<{ quantity: number }> {
    const response = await api.get<{ quantity: number }>('/clients/stats/new-this-month');
    return response.data;
  }

  static async getAllClients(page = 1, limit = 10) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        clients: mockClients,
        total: mockClients.length,
        page,
        limit
      };
    }
    const response = await api.get(`/clients?page=${page}&limit=${limit}`);
    return response.data;
  }

  static async getClientById(id: string) {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  }

  static async getClientsWithOwingMoney() {
    const response = await api.get('/clients/with-owing-money');
    return response.data;
  }

  static async getSessionsByClient(clientId: string) {
    const response = await api.get(`/clients/${clientId}/sessions`);
    return response.data;
  }

  static async createClient(clientData: {
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
  }) {
    const response = await api.post('/clients', clientData);
    return response.data;
  }

  // Session endpoints
  static async getQuantityOfSessions(): Promise<{ quantity: number }> {
    const response = await api.get<{ quantity: number }>('/sessions/stats/quantity');
    return response.data;
  }

  static async getQuantityOfSessionsThisMonth(): Promise<{ quantity: number }> {
    const response = await api.get<{ quantity: number }>('/sessions/stats/this-month');
    return response.data;
  }

  static async getQuantityOfPendingSessions(): Promise<{ quantity: number }> {
    const response = await api.get<{ quantity: number }>('/sessions/stats/pending');
    return response.data;
  }

  static async getQuantityOfCompletedSessions(): Promise<{ quantity: number }> {
    const response = await api.get<{ quantity: number }>('/sessions/stats/completed');
    return response.data;
  }

  static async getQuantityOfCancelledSessions(): Promise<{ quantity: number }> {
    const response = await api.get<{ quantity: number }>('/sessions/stats/cancelled');
    return response.data;
  }

  static async getQuantityOfRefundedSessions(): Promise<{ quantity: number }> {
    const response = await api.get<{ quantity: number }>('/sessions/stats/refunded');
    return response.data;
  }

  static async getAllSessions(filters?: SessionFilters & { page?: number; limit?: number }) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      let filteredSessions = [...mockSessions];
      
      if (filters?.status) {
        filteredSessions = filteredSessions.filter(session => session.status === filters.status);
      }
      if (filters?.serviceType) {
        filteredSessions = filteredSessions.filter(session => session.serviceType === filters.serviceType);
      }
      if (filters?.photoDeliveryStatus) {
        filteredSessions = filteredSessions.filter(session => session.photoDeliveryStatus === filters.photoDeliveryStatus);
      }
      
      return {
        sessions: filteredSessions,
        data: filteredSessions,
        total: filteredSessions.length,
        page: filters?.page || 1,
        limit: filters?.limit || 100
      };
    }
    
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get(`/sessions?${params.toString()}`);
    return response.data;
  }

  static async getSessionById(id: string) {
    const response = await api.get(`/sessions/${id}`);
    return response.data;
  }

  static async createSession(sessionData: {
    date: string;
    duration: number;
    status: string;
    serviceType: string;
    photoDeliveryStatus?: string;
    clientId: string;
  }) {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  }

  // Payment endpoints
  static async getAllPayments(page = 1, limit = 10, status?: string) {
    console.log('🔍 [API DEBUG] getAllPayments chamado com:', { page, limit, status, USE_MOCK_DATA });
    
    if (USE_MOCK_DATA) {
      console.log('📝 [API DEBUG] Usando dados mock');
      await new Promise(resolve => setTimeout(resolve, 350));
      let filteredPayments = [...mockPayments];
      
      if (status) {
        filteredPayments = filteredPayments.filter(payment => payment.status === status);
      }
      
      console.log('✅ [API DEBUG] Retornando dados mock:', filteredPayments.length, 'payments');
      return {
        payments: filteredPayments,
        data: filteredPayments,
        total: filteredPayments.length,
        page,
        limit
      };
    }
    
    console.log('🌐 [API DEBUG] Fazendo requisição para API real:', `${API_BASE_URL}/payments`);
    
    try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    
      const url = `/payments?${params.toString()}`;
      console.log('🔗 [API DEBUG] URL da requisição:', url);
      
      const response = await api.get(url);
      console.log('✅ [API DEBUG] Resposta da API:', response.status, response.data);
      
    return response.data;
    } catch (error) {
      console.error('❌ [API DEBUG] Erro na requisição:', error);
      throw error;
    }
  }

  static async getPaymentById(id: string) {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  }

  static async createPayment(paymentData: {
    amount: number;
    currency: string;
    status: string;
    method: string;
    dueDate?: string;
    clientId: string;
    sessionId?: string;
  }) {
    const response = await api.post('/payments', paymentData);
    return response.data;
  }

  static async getTotalAmountPending(): Promise<{ totalAmount: number }> {
    const response = await api.get<{ totalAmount: number }>('/payments/total-amount-pending');
    return response.data;
  }

  static async getTotalAmountPaid(): Promise<{ totalAmount: number }> {
    const response = await api.get<{ totalAmount: number }>('/payments/total-amount-paid');
    return response.data;
  }

  static async getTotalAmountCancelled(): Promise<{ totalAmount: number }> {
    const response = await api.get<{ totalAmount: number }>('/payments/total-amount-cancelled');
    return response.data;
  }

  static async getTotalAmountRefunded(): Promise<{ totalAmount: number }> {
    const response = await api.get<{ totalAmount: number }>('/payments/total-amount-refunded');
    return response.data;
  }

  static async updatePaymentStatus(id: string, status: string) {
    const response = await api.patch(`/payments/${id}/status`, { status });
    return response.data;
  }

  // Invoice endpoints
  static async getAllInvoices(page = 1, limit = 10, status?: string) {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Mock invoices data
      const mockInvoices = [
        {
          id: "inv_1",
          number: "FAT-2025-001",
          clientId: "1",
          sessionId: "sess_1",
          amount: 800,
          currency: "BRL",
          issueDate: "2025-01-15",
          dueDate: "2025-01-30",
          status: "PAID",
          description: "Sessão Newborn - Maria Silva",
          client: mockClients[0],
          session: mockSessions[0],
          createdAt: "2025-01-15T09:30:00Z",
          paidAt: "2025-01-16T14:20:00Z"
        },
        {
          id: "inv_2",
          number: "FAT-2025-002",
          clientId: "3",
          sessionId: "sess_3",
          amount: 2500,
          currency: "BRL",
          issueDate: "2025-01-05",
          dueDate: "2025-01-20",
          status: "OVERDUE",
          description: "Casamento Completo - Ana Costa",
          client: mockClients[2],
          session: mockSessions[2],
          createdAt: "2025-01-05T11:45:00Z"
        }
      ];
      
      let filteredInvoices = [...mockInvoices];
      if (status) {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.status === status);
      }
      
      return {
        invoices: filteredInvoices,
        data: filteredInvoices,
        total: filteredInvoices.length,
        page,
        limit
      };
    }
    
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);
    
    const response = await api.get(`/invoices?${params.toString()}`);
    return response.data;
  }

  static async getInvoiceById(id: string) {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  }

  static async createInvoice(invoiceData: {
    clientId: string;
    sessionId?: string;
    amount: number;
    currency: string;
    dueDate: string;
    description: string;
  }) {
    const response = await api.post('/invoices', invoiceData);
    return response.data;
  }

  static async updateInvoiceStatus(id: string, status: string) {
    const response = await api.patch(`/invoices/${id}/status`, { status });
    return response.data;
  }

  static async downloadInvoicePDF(id: string) {
    const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
    return response.data;
  }

  static async sendInvoiceByEmail(id: string, email: string) {
    const response = await api.post(`/invoices/${id}/send-email`, { email });
    return response.data;
  }

  static async sendInvoiceByWhatsApp(id: string, phone: string) {
    const response = await api.post(`/invoices/${id}/send-whatsapp`, { phone });
    return response.data;
  }

  // Update session status
  static async updateSessionStatus(id: string, status: string) {
    const response = await api.patch(`/sessions/${id}/status`, { status });
    return response.data;
  }

  static async updateSessionPhotoDeliveryStatus(id: string, photoDeliveryStatus: string) {
    const response = await api.patch(`/sessions/${id}/photo-delivery-status`, { photoDeliveryStatus });
    return response.data;
  }

  // Reports endpoints
  static async getRevenueByMonth(year?: number) {
    const params = year ? `?year=${year}` : '';
    const response = await api.get(`/reports/revenue-by-month${params}`);
    return response.data;
  }

  static async getServiceTypeStats() {
    const response = await api.get('/reports/service-type-stats');
    return response.data;
  }

  static async getTopClients(limit = 10) {
    const response = await api.get(`/reports/top-clients?limit=${limit}`);
    return response.data;
  }

  static async getSystemMetrics() {
    const response = await api.get('/reports/system-metrics');
    return response.data;
  }

  static async exportReportPDF(reportType: string, params?: any) {
    const response = await api.post(`/reports/export/pdf`, { reportType, params }, { responseType: 'blob' });
    return response.data;
  }

  static async exportReportExcel(reportType: string, params?: any) {
    const response = await api.post(`/reports/export/excel`, { reportType, params }, { responseType: 'blob' });
    return response.data;
  }

  // Configuration endpoints
  static async getSystemConfig() {
    const response = await api.get('/config/system');
    return response.data;
  }

  static async updateSystemConfig(config: any) {
    const response = await api.put('/config/system', config);
    return response.data;
  }

  static async getServiceTypes() {
    const response = await api.get('/config/service-types');
    return response.data;
  }

  static async createServiceType(serviceType: any) {
    const response = await api.post('/config/service-types', serviceType);
    return response.data;
  }

  static async updateServiceType(id: string, serviceType: any) {
    const response = await api.put(`/config/service-types/${id}`, serviceType);
    return response.data;
  }

  static async deleteServiceType(id: string) {
    const response = await api.delete(`/config/service-types/${id}`);
    return response.data;
  }

  static async getUsers() {
    const response = await api.get('/config/users');
    return response.data;
  }

  static async createUser(user: any) {
    const response = await api.post('/config/users', user);
    return response.data;
  }

  static async updateUser(id: string, user: any) {
    const response = await api.put(`/config/users/${id}`, user);
    return response.data;
  }

  static async deleteUser(id: string) {
    const response = await api.delete(`/config/users/${id}`);
    return response.data;
  }

  static async getEmailTemplates() {
    const response = await api.get('/config/email-templates');
    return response.data;
  }

  static async updateEmailTemplates(templates: any) {
    const response = await api.put('/config/email-templates', templates);
    return response.data;
  }
}

export default api; 