import "reflect-metadata";
import { EPhotoSessionCategory } from "../enums/EPhotoSessionCategory";
export declare class CreatePhotoPackageDto {
    name: string;
    category: EPhotoSessionCategory;
    description?: string;
    price: number;
    digitalPhotos: number | "UNLIMITED";
    printedPhotos?: PrintedPhotosDto | null;
    location: "STUDIO" | "EXTERNAL";
    backgroundOptions?: string[];
    album?: AlbumDto;
    availableFrom?: string;
}
declare class PrintedPhotosDto {
    quantity: number;
    size: string;
}
declare class AlbumDto {
    size: string;
    pages: number;
}
export {};
