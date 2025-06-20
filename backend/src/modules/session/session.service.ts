import { Injectable, Inject } from "@nestjs/common";
import { ISessionRepository } from "../../repositories/ISessionRepository";
import { Session } from "@shared/Session/types/Session";
import { CreateSessionDto } from "@shared/Session/dto/CreateSessionDto";
import { SystemClock } from "@shared/Session/vo/SystemClock";
import { SessionId } from "@shared/Session/vo/SessionId";
import { EPhotoDeliveryStatus } from "@shared/Session/enums/EPhotoDeliveryStatus";

const SESSION_REPOSITORY = 'SESSION_REPOSITORY';

interface SessionFilters {
  serviceType?: string;
  status?: string;
  photoDeliveryStatus?: string;
}

@Injectable()
export class SessionService {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository
  ) {}

  async createSession(createSessionDto: CreateSessionDto): Promise<Session> {
    const session: Session = {
      id: new SessionId(crypto.randomUUID()),
      date: new SystemClock(new Date(createSessionDto.date)),
      duration: createSessionDto.duration,
      status: createSessionDto.status,
      serviceType: createSessionDto.serviceType,
      photoDeliveryStatus: createSessionDto.photoDeliveryStatus || EPhotoDeliveryStatus.NOT_DELIVERED,
      clientId: createSessionDto.clientId,
    };

    await this.sessionRepository.create(session);
    return session;
  }

  async findSessionById(id: string): Promise<Session | null> {
    return this.sessionRepository.findById(id);
  }

  async deleteSession(id: string): Promise<void> {
    await this.sessionRepository.delete(id);
  }

  async findAllSessions(filters?: SessionFilters): Promise<Session[]> {
    return this.sessionRepository.findAll(filters);
  }

  async deleteAllSessions(): Promise<void> {
    await this.sessionRepository.deleteAll();
  }

  async getQuantityOfSessions(): Promise<number> {
    return this.sessionRepository.getQuantityOfSessions();
  }

  async getQuantityOfSessionsThisMonth(): Promise<number> {
    return this.sessionRepository.getQuantityOfSessionsThisMonth();
  }

  async getQuantityOfPendingSessions(): Promise<number> {
    return this.sessionRepository.getQuantityOfPendingSessions();
  }

  async getQuantityOfCompletedSessions(): Promise<number> {
    return this.sessionRepository.getQuantityOfCompletedSessions();
  }

  async getQuantityOfCancelledSessions(): Promise<number> {
    return this.sessionRepository.getQuantityOfCancelledSessions();
  }

  async getQuantityOfRefundedSessions(): Promise<number> {
    return this.sessionRepository.getQuantityOfRefundedSessions();
  }
}
