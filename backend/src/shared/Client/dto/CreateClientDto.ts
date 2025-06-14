import "reflect-metadata";
import { IsNotEmpty, IsString, IsEmail, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class NameDto {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;
}

class AddressDto {
  @IsNotEmpty()
  @IsString()
  street!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  state!: string;

  @IsNotEmpty()
  @IsString()
  zipCode!: string;
}

export class CreateClientDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => NameDto)
  name!: NameDto;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  phone!: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;
} 