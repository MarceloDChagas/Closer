import { Session } from "@shared/Session/types/Session";
import { ESessionStatus } from "@shared/Session/enums/ESessionStatus";
import { SystemClock } from "@shared/Session/vo/SystemClock";

export class SessionMapper {
  static toDomain(prismaSession: any): Session {
    return {
      id: prismaSession.id,
      date: new SystemClock(new Date(prismaSession.date)),
      duration: prismaSession.duration,
      status: prismaSession.status as ESessionStatus,
    };
  }

  static toPrisma(session: Session): any {
    return {
      id: session.id,
      date: session.date.value,
      duration: session.duration,
      status: session.status,
    };
  }
} 