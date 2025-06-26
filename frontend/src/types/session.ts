export enum SessionStatus {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum PhotoDeliveryStatus {
  NOT_DELIVERED = 'NOT_DELIVERED',
  DELIVERED = 'DELIVERED',
  PARTIAL_DELIVERED = 'PARTIAL_DELIVERED'
}

export enum ServiceType {
  ACOMPANHAMENTO = 'ACOMPANHAMENTO',
  ANIVERSARIO = 'ANIVERSARIO',
  BOOK = 'BOOK',
  CASAL = 'CASAL',
  CASAMENTO = 'CASAMENTO',
  DIA_DAS_MAES = 'DIA_DAS_MAES',
  ENSAIO_FAMILIA = 'ENSAIO_FAMILIA',
  ENSAIO_FEMININO = 'ENSAIO_FEMININO',
  ENSAIO_GESTANTE = 'ENSAIO_GESTANTE',
  ENSAIO_INFANTIL = 'ENSAIO_INFANTIL',
  EVENTO = 'EVENTO',
  FORMATURA = 'FORMATURA',
  INSTITUCIONAL = 'INSTITUCIONAL',
  MEMORIAS_POLAROID = 'MEMORIAS_POLAROID',
  NEWBORN = 'NEWBORN',
  PARTO = 'PARTO',
  SMASH_THE_CAKE = 'SMASH_THE_CAKE'
}

export interface Session {
  id: string;
  date: string;
  duration: number;
  status: SessionStatus;
  serviceType: ServiceType;
  photoDeliveryStatus: PhotoDeliveryStatus;
  clientId: string;
  client?: {
    id: string;
    name: {
      firstName: string;
      lastName: string;
    };
    email: string;
    phone: string;
  };
  location?: string;
  notes?: string;
  totalPhotos?: number;
  deliveredPhotos?: number;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSessionDto {
  date: string;
  duration: number;
  status: SessionStatus;
  serviceType: ServiceType;
  photoDeliveryStatus: PhotoDeliveryStatus;
  clientId: string;
  location?: string;
  notes?: string;
  totalPhotos?: number;
  price?: number;
}

export interface SessionFilters {
  serviceType?: ServiceType;
  status?: SessionStatus;
  photoDeliveryStatus?: PhotoDeliveryStatus;
  clientId?: string;
  dateFrom?: string;
  dateTo?: string;
} 