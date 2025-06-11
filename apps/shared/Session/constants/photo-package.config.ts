import { EPackageType } from "../enums/EPackageType";
import { IPhotoPackageConfig } from "./IPhotoPackageConfig";

export const PHOTO_PACKAGE_CONFIG: Record<EPackageType, IPhotoPackageConfig> = {
    [EPackageType.BASIC]: {
      price: 150,
      digitalPhotos: 6,
      printedPhotos: {
        quantity: 6,
        size: "15x21"
      }
    },
    [EPackageType.STANDARD]: {
      price: 200,
      digitalPhotos: 10,
      printedPhotos: {
        quantity: 10,
        size: "15x21"
      }
    },
    [EPackageType.PREMIUM]: {
      price: 1000,
      digitalPhotos: "UNLIMITED",
      printedPhotos: null,
      album: {
        size: "20x20",
        pages: 20
      }
    }
  }