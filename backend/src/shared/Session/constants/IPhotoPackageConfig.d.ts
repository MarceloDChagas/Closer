export interface IPhotoPackageConfig {
    price: number;
    digitalPhotos: number | "UNLIMITED";
    printedPhotos: {
        quantity: number;
        size: string;
    } | null;
    album?: {
        size: string;
        pages: number;
    };
}
