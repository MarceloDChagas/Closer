import "reflect-metadata";
import { IsNotEmpty, IsString, IsNumber, IsDateString } from "class-validator";
import { ESessionStatus } from "../enums/ESessionStatus";

export class CreateSessionDto {
  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @IsNotEmpty()
  @IsNumber()
  duration!: number;

  @IsNotEmpty()
  @IsString()
  status!: ESessionStatus;
} 