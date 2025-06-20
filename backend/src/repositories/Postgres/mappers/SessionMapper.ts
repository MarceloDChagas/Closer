import { Session } from "@shared/Session/types/Session";
import { SessionId } from "@shared/Session/vo/SessionId";
import { ESessionStatus } from "@shared/Session/enums/ESessionStatus";
import { EServiceType } from "@shared/Session/enums/EServiceType";
import { EPhotoDeliveryStatus } from "@shared/Session/enums/EPhotoDeliveryStatus";
import { SystemClock } from "@shared/Session/vo/SystemClock";

export class SessionMapper {
  static toDomain(session: any): Session {
    return {
      id: new SessionId(session.id),
      date: new SystemClock(new Date(session.date)),
      duration: session.duration,
      status: session.status as ESessionStatus,
      serviceType: session.serviceType as EServiceType,
      photoDeliveryStatus: session.photoDeliveryStatus as EPhotoDeliveryStatus,
      clientId: session.clientId,
    };
  }

  static toPersistence(session: Session): any {
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