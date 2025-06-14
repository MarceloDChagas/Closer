import { EPhotoSessionCategory } from "../enums/EPhotoSessionCategory";
export type PhotoPackage = {
    id: string;
    name: string;
    category: EPhotoSessionCategory;
    description?: string;
    price: number;
    digitalPhotos: number | "UNLIMITED";
    printedPhotos?: {
        quantity: number;
        size: string;
    } | null;
    location: "STUDIO" | "EXTERNAL";
    backgroundOptions?: string[];
    album?: {
        size: string;
        pages: number;
    };
    availableFrom?: Date;
};
