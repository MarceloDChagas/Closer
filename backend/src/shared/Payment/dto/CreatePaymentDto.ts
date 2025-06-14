import "reflect-metadata";
import { IsNotEmpty, IsString, IsNumber, IsPositive, IsEnum, IsOptional } from "class-validator";
import { EPaymentMethod } from "../enums/EPaymentMethod";

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  clientId!: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsNotEmpty()
  @IsString()
  currency!: string;

  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsNotEmpty()
  @IsEnum(EPaymentMethod)
  method!: EPaymentMethod;
} 