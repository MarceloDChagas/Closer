import { Session } from '../types/Session';

export class SessionResponseDto {
  id: string;
  date: Date;
  duration: number;
  status: string;
  serviceType: string;
  photoDeliveryStatus: string;
  clientId: string;

  static fromDomain(session: Session): SessionResponseDto {
    return {
      id: session.id.value,
      date: session.date.value,
      duration: session.duration,
      status: session.status,
      serviceType: session.serviceType,
      photoDeliveryStatus: session.photoDeliveryStatus,
      clientId: session.clientId,
    };
  }
} 