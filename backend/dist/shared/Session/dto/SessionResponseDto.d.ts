import { Session } from '../types/Session';
export declare class SessionResponseDto {
    id: string;
    date: Date;
    duration: number;
    status: string;
    serviceType: string;
    photoDeliveryStatus: string;
    clientId: string;
    static fromDomain(session: Session): SessionResponseDto;
}
