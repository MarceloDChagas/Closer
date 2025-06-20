import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { EPaymentMethod } from '../enums/EPaymentMethod';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsEnum(EPaymentMethod)
  method: EPaymentMethod;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
} 