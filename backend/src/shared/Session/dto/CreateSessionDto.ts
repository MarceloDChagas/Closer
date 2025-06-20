import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ESessionStatus } from '../enums/ESessionStatus';
import { EServiceType } from '../enums/EServiceType';
import { EPhotoDeliveryStatus } from '../enums/EPhotoDeliveryStatus';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  duration: number;

  @IsNotEmpty()
  @IsString()
  status: ESessionStatus;

  @IsNotEmpty()
  @IsString()
  serviceType: EServiceType;

  @IsOptional()
  @IsString()
  photoDeliveryStatus?: EPhotoDeliveryStatus;
} 