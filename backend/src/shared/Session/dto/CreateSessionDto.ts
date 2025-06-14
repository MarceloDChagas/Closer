import "reflect-metadata";
import { IsNotEmpty, IsString, IsNumber, IsPositive, IsDateString } from "class-validator";
import { ESessionStatus } from "../enums/ESessionStatus";

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  clientId!: string;

  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  duration!: number;

  @IsNotEmpty()
  @IsString()
  status!: ESessionStatus;
} 