import { PhotoPackage } from "../types/PhotoPackage";
import { EPhotoSessionCategory } from "../enums/EPhotoSessionCategory";
export { EPhotoSessionCategory };
export declare const PHOTO_PACKAGES: PhotoPackage[];
export declare function getPackagesByCategory(category: EPhotoSessionCategory): PhotoPackage[];
export declare function getPackageById(id: string): PhotoPackage | undefined;
export declare function getPackagesByLocation(location: "STUDIO" | "EXTERNAL"): PhotoPackage[];
export declare function getPackagesByPriceRange(minPrice: number, maxPrice: number): PhotoPackage[];
