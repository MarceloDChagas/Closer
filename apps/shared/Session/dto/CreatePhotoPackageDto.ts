import "reflect-metadata";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsPositive,
  IsArray,
  IsDateString,
  ValidateNested,
  IsIn,
} from "class-validator";
import { Type } from "class-transformer";
import { EPhotoSessionCategory } from "../enums/EPhotoSessionCategory";

export class CreatePhotoPackageDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEnum(EPhotoSessionCategory)
  category!: EPhotoSessionCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price!: number;

  @IsNotEmpty()
  digitalPhotos!: number | "UNLIMITED";

  @IsOptional()
  @ValidateNested()
  @Type(() => PrintedPhotosDto)
  printedPhotos?: PrintedPhotosDto | null;

  @IsNotEmpty()
  @IsIn(["STUDIO", "EXTERNAL"])
  location!: "STUDIO" | "EXTERNAL";

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  backgroundOptions?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => AlbumDto)
  album?: AlbumDto;

  @IsOptional()
  @IsDateString()
  availableFrom?: string;
}

class PrintedPhotosDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity!: number;

  @IsNotEmpty()
  @IsString()
  size!: string;
}

class AlbumDto {
  @IsNotEmpty()
  @IsString()
  size!: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  pages!: number;
} 