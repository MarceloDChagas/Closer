import { ESessionStatus } from '../enums/ESessionStatus';
import { EServiceType } from '../enums/EServiceType';
import { EPhotoDeliveryStatus } from '../enums/EPhotoDeliveryStatus';
export declare class CreateSessionDto {
    clientId: string;
    date: string;
    duration: number;
    status: ESessionStatus;
    serviceType: EServiceType;
    photoDeliveryStatus?: EPhotoDeliveryStatus;
}
