import { PhotoPackage } from "../types/PhotoPackage";
import { EPhotoSessionCategory } from "../enums/EPhotoSessionCategory";

// Re-export for convenience
export { EPhotoSessionCategory };

export const PHOTO_PACKAGES: PhotoPackage[] = [
  // Dia das Mães
  {
    id: "mothers-basic",
    name: "Pacote 1 - Dia das Mães",
    category: EPhotoSessionCategory.MOTHERS_DAY,
    description: "Ensaio especial para o Dia das Mães",
    price: 150,
    digitalPhotos: 6,
    printedPhotos: {
      quantity: 6,
      size: "15x21",
    },
    location: "STUDIO",
  },
  {
    id: "mothers-standard",
    name: "Pacote 2 - Dia das Mães",
    category: EPhotoSessionCategory.MOTHERS_DAY,
    description: "Ensaio completo para o Dia das Mães",
    price: 200,
    digitalPhotos: 10,
    printedPhotos: {
      quantity: 10,
      size: "15x21",
    },
    location: "STUDIO",
  },
  {
    id: "mothers-premium",
    name: "Pacote 3 - Dia das Mães Premium",
    category: EPhotoSessionCategory.MOTHERS_DAY,
    description: "Ensaio premium com álbum personalizado",
    price: 1000,
    digitalPhotos: "UNLIMITED",
    printedPhotos: null,
    location: "STUDIO",
    album: {
      size: "20x20",
      pages: 20,
    },
  },

  // Família
  {
    id: "family-studio",
    name: "Pacote 1 - Família (Estúdio)",
    category: EPhotoSessionCategory.FAMILY,
    description: "Ensaio familiar em estúdio com fundos temáticos",
    price: 300,
    digitalPhotos: 10,
    printedPhotos: null,
    location: "STUDIO",
    backgroundOptions: ["white", "boho", "neutral"],
  },
  {
    id: "family-external",
    name: "Pacote 2 - Família (Externo)",
    category: EPhotoSessionCategory.FAMILY,
    description: "Ensaio familiar em ambiente externo",
    price: 400,
    digitalPhotos: 20,
    printedPhotos: {
      quantity: 15,
      size: "13x18",
    },
    location: "EXTERNAL",
  },
  {
    id: "family-premium",
    name: "Pacote 3 - Família Premium",
    category: EPhotoSessionCategory.FAMILY,
    description: "Ensaio premium com fotos ilimitadas",
    price: 1000,
    digitalPhotos: "UNLIMITED",
    printedPhotos: null,
    location: "EXTERNAL",
    album: {
      size: "25x25",
      pages: 30,
    },
  },

  // Baby
  {
    id: "baby-newborn",
    name: "Ensaio Newborn",
    category: EPhotoSessionCategory.BABY,
    description: "Ensaio especializado para recém-nascidos",
    price: 350,
    digitalPhotos: 15,
    printedPhotos: {
      quantity: 10,
      size: "15x21",
    },
    location: "STUDIO",
    backgroundOptions: ["pastel", "neutral", "vintage"],
  },

  // Aniversário
  {
    id: "birthday-smash-cake",
    name: "Smash the Cake",
    category: EPhotoSessionCategory.BIRTHDAY,
    description: "Ensaio de primeiro aniversário com bolo",
    price: 250,
    digitalPhotos: 12,
    printedPhotos: {
      quantity: 8,
      size: "13x18",
    },
    location: "STUDIO",
    backgroundOptions: ["colorful", "vintage", "minimalist"],
  },
];

export function getPackagesByCategory(
  category: EPhotoSessionCategory
): PhotoPackage[] {
  return PHOTO_PACKAGES.filter((pkg) => pkg.category === category);
}

export function getPackageById(id: string): PhotoPackage | undefined {
  return PHOTO_PACKAGES.find((pkg) => pkg.id === id);
}

export function getPackagesByLocation(
  location: "STUDIO" | "EXTERNAL"
): PhotoPackage[] {
  return PHOTO_PACKAGES.filter((pkg) => pkg.location === location);
}

export function getPackagesByPriceRange(
  minPrice: number,
  maxPrice: number
): PhotoPackage[] {
  return PHOTO_PACKAGES.filter(
    (pkg) => pkg.price >= minPrice && pkg.price <= maxPrice
  );
} 