import { SessionId } from '../vo/SessionId';
import { SystemClock } from '../vo/SystemClock';
import { ESessionStatus } from '../enums/ESessionStatus';
import { EServiceType } from '../enums/EServiceType';
import { EPhotoDeliveryStatus } from '../enums/EPhotoDeliveryStatus';
export interface Session {
    id: SessionId;
    date: SystemClock;
    duration: number;
    status: ESessionStatus;
    serviceType: EServiceType;
    photoDeliveryStatus: EPhotoDeliveryStatus;
    clientId: string;
    observations?: string;
    paymentId?: string;
    photoQuantity?: number;
    discount?: number;
}
