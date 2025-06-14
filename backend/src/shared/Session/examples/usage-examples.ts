import {
  PHOTO_PACKAGES,
  EPhotoSessionCategory,
  getPackagesByCategory,
  getPackageById,
  getPackagesByLocation,
  getPackagesByPriceRange,
} from "../constants/PhotoPackages";


const mothersPackages = getPackagesByCategory(EPhotoSessionCategory.MOTHERS_DAY);
console.log("Pacotes Dia das Mães:", mothersPackages);

const familyStudioPackage = getPackageById("family-studio");
console.log("Pacote Família Estúdio:", familyStudioPackage);

const studioPackages = getPackagesByLocation("STUDIO");
const externalPackages = getPackagesByLocation("EXTERNAL");
console.log("Pacotes de Estúdio:", studioPackages.length);
console.log("Pacotes Externos:", externalPackages.length);

const budgetPackages = getPackagesByPriceRange(100, 300);
const premiumPackages = getPackagesByPriceRange(500, 1500);
console.log("Pacotes até R$300:", budgetPackages);
console.log("Pacotes Premium:", premiumPackages);

const availableCategories = [
  ...new Set(PHOTO_PACKAGES.map((pkg) => pkg.category)),
];
console.log("Categorias disponíveis:", availableCategories);

const packagesWithAlbum = PHOTO_PACKAGES.filter((pkg) => pkg.album);
console.log("Pacotes com álbum:", packagesWithAlbum);

const packagesByPrice = [...PHOTO_PACKAGES].sort((a, b) => a.price - b.price);
console.log("Pacotes ordenados por preço:", packagesByPrice);

const stats = {
  totalPackages: PHOTO_PACKAGES.length,
  averagePrice:
    PHOTO_PACKAGES.reduce((sum, pkg) => sum + pkg.price, 0) /
    PHOTO_PACKAGES.length,
  categoriesCount: availableCategories.length,
  studioCount: studioPackages.length,
  externalCount: externalPackages.length,
};
console.log("Estatísticas:", stats); 