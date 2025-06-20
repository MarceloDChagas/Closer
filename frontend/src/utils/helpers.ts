import { PaymentStatus, PaymentMethod, SessionStatus, PhotoDeliveryStatus, ServiceType } from "../types";

// Payment helpers
export const getPaymentStatusLabel = (status: PaymentStatus): string => {
  const labels: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'A receber',
    [PaymentStatus.COMPLETED]: 'Recebido',
    [PaymentStatus.CANCELLED]: 'Cancelado',
    [PaymentStatus.REFUNDED]: 'Reembolsado',
    [PaymentStatus.FAILED]: 'Falhou'
  };
  return labels[status] || status || 'Indefinido';
};

export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  const labels: Record<PaymentMethod, string> = {
    [PaymentMethod.PIX]: 'PIX',
    [PaymentMethod.CREDIT_CARD]: 'Cartão de Crédito',
    [PaymentMethod.DEBIT_CARD]: 'Cartão de Débito',
    [PaymentMethod.BANK_TRANSFER]: 'Transferência Bancária',
    [PaymentMethod.CASH]: 'Dinheiro',
    [PaymentMethod.BOLETO]: 'Boleto'
  };
  return labels[method] || method;
};

export const getPaymentStatusColor = (status: PaymentStatus): string => {
  const colors: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: 'bg-yellow-500/15 text-yellow-800 dark:bg-yellow-500/40 dark:text-yellow-100 border border-yellow-500/30 dark:border-yellow-400',
    [PaymentStatus.COMPLETED]: 'bg-green-500/15 text-green-800 dark:bg-green-500/40 dark:text-green-100 border border-green-500/30 dark:border-green-400',
    [PaymentStatus.CANCELLED]: 'bg-red-500/15 text-red-800 dark:bg-red-500/40 dark:text-red-100 border border-red-500/30 dark:border-red-400',
    [PaymentStatus.REFUNDED]: 'bg-orange-500/15 text-orange-800 dark:bg-orange-500/40 dark:text-orange-100 border border-orange-500/30 dark:border-orange-400',
    [PaymentStatus.FAILED]: 'bg-red-500/15 text-red-800 dark:bg-red-500/40 dark:text-red-100 border border-red-500/30 dark:border-red-400'
  };
  return colors[status] || 'bg-gray-500/15 text-gray-800 dark:bg-gray-500/40 dark:text-gray-100 border border-gray-500/30 dark:border-gray-400';
};

// Session helpers
export const getSessionStatusLabel = (status: SessionStatus): string => {
  const labels: Record<SessionStatus, string> = {
    [SessionStatus.PENDING]: 'Pendente',
    [SessionStatus.SCHEDULED]: 'Agendada',
    [SessionStatus.IN_PROGRESS]: 'Em Andamento',
    [SessionStatus.COMPLETED]: 'Completada',
    [SessionStatus.CANCELLED]: 'Cancelada',
    [SessionStatus.REFUNDED]: 'Reembolsada'
  };
  return labels[status] || status || 'Indefinido';
};

export const getPhotoDeliveryStatusLabel = (status: PhotoDeliveryStatus): string => {
  const labels: Record<PhotoDeliveryStatus, string> = {
    [PhotoDeliveryStatus.NOT_DELIVERED]: 'Não Entregue',
    [PhotoDeliveryStatus.DELIVERED]: 'Entregue',
    [PhotoDeliveryStatus.PARTIAL_DELIVERED]: 'Parcialmente Entregue'
  };
  return labels[status] || status || 'Indefinido';
};

export const getServiceTypeLabel = (type: ServiceType): string => {
  const labels: Record<ServiceType, string> = {
    [ServiceType.ACOMPANHAMENTO]: 'Acompanhamento',
    [ServiceType.ANIVERSARIO]: 'Aniversário',
    [ServiceType.BOOK]: 'Book',
    [ServiceType.CASAL]: 'Casal',
    [ServiceType.CASAMENTO]: 'Casamento',
    [ServiceType.DIA_DAS_MAES]: 'Dia das Mães',
    [ServiceType.ENSAIO_FAMILIA]: 'Ensaio Família',
    [ServiceType.ENSAIO_FEMININO]: 'Ensaio Feminino',
    [ServiceType.ENSAIO_GESTANTE]: 'Ensaio Gestante',
    [ServiceType.ENSAIO_INFANTIL]: 'Ensaio Infantil',
    [ServiceType.EVENTO]: 'Evento',
    [ServiceType.FORMATURA]: 'Formatura',
    [ServiceType.INSTITUCIONAL]: 'Institucional',
    [ServiceType.MEMORIAS_POLAROID]: 'Memórias Polaroid',
    [ServiceType.NEWBORN]: 'Newborn',
    [ServiceType.PARTO]: 'Parto',
    [ServiceType.SMASH_THE_CAKE]: 'Smash the Cake'
  };
  return labels[type] || type;
};

export const getSessionStatusColor = (status: SessionStatus): string => {
  const colors: Record<SessionStatus, string> = {
    [SessionStatus.PENDING]: 'bg-yellow-500/15 text-yellow-800 dark:bg-yellow-500/40 dark:text-yellow-100 border border-yellow-500/30 dark:border-yellow-400',
    [SessionStatus.SCHEDULED]: 'bg-blue-500/15 text-blue-800 dark:bg-blue-500/40 dark:text-blue-100 border border-blue-500/30 dark:border-blue-400',
    [SessionStatus.IN_PROGRESS]: 'bg-purple-500/15 text-purple-800 dark:bg-purple-500/40 dark:text-purple-100 border border-purple-500/30 dark:border-purple-400',
    [SessionStatus.COMPLETED]: 'bg-green-500/15 text-green-800 dark:bg-green-500/40 dark:text-green-100 border border-green-500/30 dark:border-green-400',
    [SessionStatus.CANCELLED]: 'bg-red-500/15 text-red-800 dark:bg-red-500/40 dark:text-red-100 border border-red-500/30 dark:border-red-400',
    [SessionStatus.REFUNDED]: 'bg-orange-500/15 text-orange-800 dark:bg-orange-500/40 dark:text-orange-100 border border-orange-500/30 dark:border-orange-400'
  };
  return colors[status] || 'bg-gray-500/15 text-gray-800 dark:bg-gray-500/40 dark:text-gray-100 border border-gray-500/30 dark:border-gray-400';
};

export const getPhotoDeliveryStatusColor = (status: PhotoDeliveryStatus): string => {
  const colors: Record<PhotoDeliveryStatus, string> = {
    [PhotoDeliveryStatus.NOT_DELIVERED]: 'bg-red-500/15 text-red-800 dark:bg-red-500/40 dark:text-red-100 border border-red-500/30 dark:border-red-400',
    [PhotoDeliveryStatus.DELIVERED]: 'bg-green-500/15 text-green-800 dark:bg-green-500/40 dark:text-green-100 border border-green-500/30 dark:border-green-400',
    [PhotoDeliveryStatus.PARTIAL_DELIVERED]: 'bg-yellow-500/15 text-yellow-800 dark:bg-yellow-500/40 dark:text-yellow-100 border border-yellow-500/30 dark:border-yellow-400'
  };
  return colors[status] || 'bg-gray-500/15 text-gray-800 dark:bg-gray-500/40 dark:text-gray-100 border border-gray-500/30 dark:border-gray-400';
};

// Currency helper
export const formatCurrency = (value: number): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'R$ 0,00';
  }
  return value.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });
};

// Date helpers
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('pt-BR');
}; 