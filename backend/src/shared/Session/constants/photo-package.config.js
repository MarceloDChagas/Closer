"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHOTO_PACKAGE_CONFIG = void 0;
const EPackageType_1 = require("../enums/EPackageType");
exports.PHOTO_PACKAGE_CONFIG = {
    [EPackageType_1.EPackageType.BASIC]: {
        price: 150,
        digitalPhotos: 6,
        printedPhotos: {
            quantity: 6,
            size: "15x21"
        }
    },
    [EPackageType_1.EPackageType.STANDARD]: {
        price: 200,
        digitalPhotos: 10,
        printedPhotos: {
            quantity: 10,
            size: "15x21"
        }
    },
    [EPackageType_1.EPackageType.PREMIUM]: {
        price: 1000,
        digitalPhotos: "UNLIMITED",
        printedPhotos: null,
        album: {
            size: "20x20",
            pages: 20
        }
    }
};
//# sourceMappingURL=photo-package.config.js.map