import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { SessionService } from "./session.service";
import { CreateSessionDto } from "@shared/Session/dto/CreateSessionDto";
import { SessionResponseDto } from "@shared/Session/dto/SessionResponseDto";

@Controller("sessions")
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    const session = await this.sessionService.createSession(createSessionDto);
    return SessionResponseDto.fromDomain(session);
  }

  @Get()
  async findAllSessions() {
    const sessions = await this.sessionService.findAllSessions();
    return sessions.map(session => SessionResponseDto.fromDomain(session));
  }

  @Get(":id")
  async findSessionById(@Param("id") id: string) {
    const session = await this.sessionService.findSessionById(id);
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    return SessionResponseDto.fromDomain(session);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession(@Param("id") id: string) {
    const session = await this.sessionService.findSessionById(id);
    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }
    await this.sessionService.deleteSession(id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllSessions() {
    await this.sessionService.deleteAllSessions();
  }
}
