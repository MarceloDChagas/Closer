"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PhotoPackages_1 = require("../constants/PhotoPackages");
const mothersPackages = (0, PhotoPackages_1.getPackagesByCategory)(PhotoPackages_1.EPhotoSessionCategory.MOTHERS_DAY);
console.log("Pacotes Dia das Mães:", mothersPackages);
const familyStudioPackage = (0, PhotoPackages_1.getPackageById)("family-studio");
console.log("Pacote Família Estúdio:", familyStudioPackage);
const studioPackages = (0, PhotoPackages_1.getPackagesByLocation)("STUDIO");
const externalPackages = (0, PhotoPackages_1.getPackagesByLocation)("EXTERNAL");
console.log("Pacotes de Estúdio:", studioPackages.length);
console.log("Pacotes Externos:", externalPackages.length);
const budgetPackages = (0, PhotoPackages_1.getPackagesByPriceRange)(100, 300);
const premiumPackages = (0, PhotoPackages_1.getPackagesByPriceRange)(500, 1500);
console.log("Pacotes até R$300:", budgetPackages);
console.log("Pacotes Premium:", premiumPackages);
const availableCategories = [
    ...new Set(PhotoPackages_1.PHOTO_PACKAGES.map((pkg) => pkg.category)),
];
console.log("Categorias disponíveis:", availableCategories);
const packagesWithAlbum = PhotoPackages_1.PHOTO_PACKAGES.filter((pkg) => pkg.album);
console.log("Pacotes com álbum:", packagesWithAlbum);
const packagesByPrice = [...PhotoPackages_1.PHOTO_PACKAGES].sort((a, b) => a.price - b.price);
console.log("Pacotes ordenados por preço:", packagesByPrice);
const stats = {
    totalPackages: PhotoPackages_1.PHOTO_PACKAGES.length,
    averagePrice: PhotoPackages_1.PHOTO_PACKAGES.reduce((sum, pkg) => sum + pkg.price, 0) /
        PhotoPackages_1.PHOTO_PACKAGES.length,
    categoriesCount: availableCategories.length,
    studioCount: studioPackages.length,
    externalCount: externalPackages.length,
};
console.log("Estatísticas:", stats);
