import { PaymentStatus, PaymentMethod, SessionStatus, PhotoDeliveryStatus, ServiceType } from "../types";

// Mock data for testing

export const mockClients = [
  {
    id: "1",
    name: {
      firstName: "Maria",
      lastName: "Silva"
    },
    email: "maria.silva@email.com",
    phone: "(11) 99999-1111",
    address: {
      street: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567"
    }
  },
  {
    id: "2",
    name: {
      firstName: "João",
      lastName: "Santos"
    },
    email: "joao.santos@email.com",
    phone: "(11) 99999-2222",
    address: {
      street: "Av. Principal, 456",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-890"
    }
  },
  {
    id: "3",
    name: {
      firstName: "Ana",
      lastName: "Costa"
    },
    email: "ana.costa@email.com",
    phone: "(11) 99999-3333",
    address: {
      street: "Rua da Paz, 789",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-123"
    }
  }
];

export const mockSessions = [
  {
    id: "sess_1",
    date: "2025-01-20T10:00:00Z",
    duration: 120,
    status: SessionStatus.SCHEDULED,
    serviceType: ServiceType.NEWBORN,
    photoDeliveryStatus: PhotoDeliveryStatus.NOT_DELIVERED,
    clientId: "1",
    client: mockClients[0],
    location: "Estúdio Principal",
    notes: "Sessão newborn para bebê de 15 dias",
    totalPhotos: 50,
    deliveredPhotos: 0,
    price: 800,
    createdAt: "2025-01-15T09:00:00Z"
  },
  {
    id: "sess_2",
    date: "2025-01-18T14:00:00Z",
    duration: 90,
    status: SessionStatus.COMPLETED,
    serviceType: ServiceType.BOOK,
    photoDeliveryStatus: PhotoDeliveryStatus.DELIVERED,
    clientId: "2",
    client: mockClients[1],
    location: "Parque da Cidade",
    notes: "Book fotográfico externo",
    totalPhotos: 30,
    deliveredPhotos: 30,
    price: 500,
    createdAt: "2025-01-10T15:30:00Z"
  },
  {
    id: "sess_3",
    date: "2025-01-25T16:00:00Z",
    duration: 180,
    status: SessionStatus.IN_PROGRESS,
    serviceType: ServiceType.CASAMENTO,
    photoDeliveryStatus: PhotoDeliveryStatus.NOT_DELIVERED,
    clientId: "3",
    client: mockClients[2],
    location: "Igreja São José",
    notes: "Casamento completo com cerimônia e festa",
    totalPhotos: 200,
    deliveredPhotos: 0,
    price: 2500,
    createdAt: "2025-01-05T11:20:00Z"
  },
  {
    id: "sess_4",
    date: "2025-01-12T13:00:00Z",
    duration: 60,
    status: SessionStatus.COMPLETED,
    serviceType: ServiceType.ENSAIO_FAMILIA,
    photoDeliveryStatus: PhotoDeliveryStatus.PARTIAL_DELIVERED,
    clientId: "1",
    client: mockClients[0],
    location: "Estúdio Principal",
    notes: "Ensaio família com 2 crianças",
    totalPhotos: 40,
    deliveredPhotos: 20,
    price: 400,
    createdAt: "2025-01-08T10:15:00Z"
  }
];

export const mockPayments = [
  {
    id: "pay_1",
    amount: 800,
    currency: "BRL",
    status: PaymentStatus.COMPLETED,
    method: PaymentMethod.PIX,
    dueDate: "2025-01-20",
    clientId: "1",
    sessionId: "sess_1",
    client: mockClients[0],
    session: mockSessions[0],
    createdAt: "2025-01-15T09:30:00Z",
    updatedAt: "2025-01-16T14:20:00Z"
  },
  {
    id: "pay_2",
    amount: 500,
    currency: "BRL",
    status: PaymentStatus.PENDING,
    method: PaymentMethod.CREDIT_CARD,
    dueDate: "2025-01-25",
    clientId: "2",
    sessionId: "sess_2",
    client: mockClients[1],
    session: mockSessions[1],
    createdAt: "2025-01-10T16:00:00Z"
  },
  {
    id: "pay_3",
    amount: 1250,
    currency: "BRL",
    status: PaymentStatus.PENDING,
    method: PaymentMethod.BANK_TRANSFER,
    dueDate: "2025-01-22",
    clientId: "3",
    sessionId: "sess_3",
    client: mockClients[2],
    session: mockSessions[2],
    createdAt: "2025-01-05T11:45:00Z"
  },
  {
    id: "pay_4",
    amount: 1250,
    currency: "BRL",
    status: PaymentStatus.PENDING,
    method: PaymentMethod.PIX,
    dueDate: "2025-02-01",
    clientId: "3",
    sessionId: "sess_3",
    client: mockClients[2],
    session: mockSessions[2],
    createdAt: "2025-01-05T11:50:00Z"
  },
  {
    id: "pay_5",
    amount: 400,
    currency: "BRL",
    status: PaymentStatus.COMPLETED,
    method: PaymentMethod.CASH,
    dueDate: "2025-01-15",
    clientId: "1",
    sessionId: "sess_4",
    client: mockClients[0],
    session: mockSessions[3],
    createdAt: "2025-01-08T10:30:00Z",
    updatedAt: "2025-01-12T13:45:00Z"
  }
];

export const mockDashboardStats = {
  totalClients: mockClients.length,
  newClientsThisMonth: 2,
  totalSessions: mockSessions.length,
  sessionsThisMonth: 3,
  pendingSessions: mockSessions.filter(s => s.status === SessionStatus.SCHEDULED || s.status === SessionStatus.IN_PROGRESS).length,
  completedSessions: mockSessions.filter(s => s.status === SessionStatus.COMPLETED).length,
  cancelledSessions: 0,
  refundedSessions: 0,
  totalRevenue: mockPayments.filter(p => p.status === PaymentStatus.COMPLETED).reduce((sum, p) => sum + p.amount, 0),
  pendingAmount: mockPayments.filter(p => p.status === PaymentStatus.PENDING).reduce((sum, p) => sum + p.amount, 0),
  deliveredPhotos: mockSessions.reduce((sum, s) => sum + (s.deliveredPhotos || 0), 0),
  pendingPhotos: mockSessions.reduce((sum, s) => sum + ((s.totalPhotos || 0) - (s.deliveredPhotos || 0)), 0)
};

// Flag to enable/disable mock data
export const USE_MOCK_DATA = false; 