import { Session } from "@shared/Session/types/Session";
import { SessionId } from "@shared/Session/vo/SessionId";
import { SystemClock } from "@shared/Session/vo/SystemClock";

type PrismaSession = {
  id: string;
  date: Date;
  duration: number;
  status: string;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
};

export function mapToPrisma(session: Session): Omit<PrismaSession, "id" | "createdAt" | "updatedAt"> {
  return {
    date: session.date.value,
    duration: session.duration,
    status: session.status,
    clientId: session.clientId,
  };
}

export function mapToDomain(session: PrismaSession): Session {
  return {
    id: new SessionId(session.id),
    date: new SystemClock(session.date),
    duration: session.duration,
    status: session.status,
    clientId: session.clientId,
  };
} 