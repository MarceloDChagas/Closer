import "reflect-metadata";
import { IsNotEmpty, IsString, IsNumber, IsPositive } from "class-validator";

export class CreatePaymentDto {
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
} 