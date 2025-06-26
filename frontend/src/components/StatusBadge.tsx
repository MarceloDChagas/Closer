import React from 'react';
import { PaymentStatus, PhotoDeliveryStatus, SessionStatus } from '../types';
import { 
  getPaymentStatusColor, 
  getPaymentStatusLabel,
  getPhotoDeliveryStatusColor,
  getPhotoDeliveryStatusLabel,
  getSessionStatusColor,
  getSessionStatusLabel 
} from '../utils/helpers';

interface StatusBadgeProps {
  status: PaymentStatus | PhotoDeliveryStatus | SessionStatus | string;
  type: 'payment' | 'photo' | 'session';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
  let colorClass = '';
  let label = '';

  switch (type) {
    case 'payment':
      colorClass = getPaymentStatusColor(status as PaymentStatus);
      label = getPaymentStatusLabel(status as PaymentStatus);
      break;
    case 'photo':
      colorClass = getPhotoDeliveryStatusColor(status as PhotoDeliveryStatus);
      label = getPhotoDeliveryStatusLabel(status as PhotoDeliveryStatus);
      break;
    case 'session':
      colorClass = getSessionStatusColor(status as SessionStatus);
      label = getSessionStatusLabel(status as SessionStatus);
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      label = String(status);
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}; 