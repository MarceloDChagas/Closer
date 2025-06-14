import { Session } from "../types/Session";
import { Expose } from "class-transformer";
import { SystemClock } from "../vo/SystemClock";

export class SessionResponseDto {
  @Expose()
  id!: string;

  @Expose()
  date!: string;

  @Expose()
  duration!: number;

  @Expose()
  status!: string;

  @Expose()
  clientId!: string;

  static fromDomain(session: Session): SessionResponseDto {
    const dto = new SessionResponseDto();
    dto.id = session.id.toString();
    dto.date = session.date.value.toISOString();
    dto.duration = session.duration;
    dto.status = session.status;
    dto.clientId = session.clientId;
    return dto;
  }
} 