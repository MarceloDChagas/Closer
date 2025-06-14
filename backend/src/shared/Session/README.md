# 📸 Photo Session Packages - Nova Estrutura

## 🎯 Visão Geral

Esta nova estrutura organiza os pacotes de ensaio fotográfico de forma escalável e type-safe, permitindo fácil manutenção e expansão.

## 🏗️ Estrutura de Arquivos

```
Session/
├── enums/
│   ├── PhotoSessionCategory.ts    # Categorias de ensaio
│   ├── ESessionStatus.ts         # Status de sessão
│   └── EPackageType.ts          # Tipos de pacote (legacy)
├── types/
│   ├── PhotoPackage.ts          # Tipo base para pacotes
│   └── Session.ts               # Interface de sessão
├── constants/
│   └── PhotoPackages.ts         # Lista centralizada + utilitários
├── dto/
│   ├── CreateSessionDto.ts      # DTO para sessões
│   └── CreatePhotoPackageDto.ts # DTO para pacotes
├── vo/
│   └── SystemClock.ts           # Value Object para datas
└── examples/
    └── usage-examples.ts        # Exemplos de uso
```

## 📦 Principais Componentes

### 1. PhotoSessionCategory (Enum)
Define as categorias de ensaio disponíveis:
- `MOTHERS_DAY` - Dia das Mães
- `FAMILY` - Família
- `WEDDING` - Casamento
- `BABY` - Bebê/Newborn
- `BIRTHDAY` - Aniversário

### 2. PhotoPackage (Type)
Modelo base genérico para qualquer pacote:
```ts
type PhotoPackage = {
  id: string
  name: string
  category: PhotoSessionCategory
  description?: string
  price: number
  digitalPhotos: number | "UNLIMITED"
  printedPhotos?: { quantity: number; size: string } | null
  location: "STUDIO" | "EXTERNAL"
  backgroundOptions?: string[]
  album?: { size: string; pages: number }
  availableFrom?: Date
}
```

### 3. PHOTO_PACKAGES (Constante)
Lista centralizada com todos os pacotes organizados por categoria.

## 🛠️ Funções Utilitárias

### `getPackagesByCategory(category: PhotoSessionCategory)`
Filtra pacotes por categoria.

### `getPackageById(id: string)`
Busca pacote específico por ID.

### `getPackagesByLocation(location: "STUDIO" | "EXTERNAL")`
Filtra pacotes por localização.

### `getPackagesByPriceRange(minPrice: number, maxPrice: number)`
Filtra pacotes por faixa de preço.

## 💡 Exemplos de Uso

```ts
import { 
  getPackagesByCategory, 
  PhotoSessionCategory 
} from '@shared/Session';

// Buscar pacotes de Dia das Mães
const mothersPackages = getPackagesByCategory(PhotoSessionCategory.MOTHERS_DAY);

// Buscar pacotes de estúdio até R$300
const budgetStudioPackages = getPackagesByLocation("STUDIO")
  .filter(pkg => pkg.price <= 300);
```

## ✅ Vantagens

- **📚 Escalabilidade**: Fácil adição de novos tipos de ensaio
- **🔁 Reutilização**: Frontend/backend compartilham os mesmos modelos
- **🎯 Organização**: Filtragem por categoria, localização, preço
- **🧩 Flexibilidade**: Campos opcionais para expansão futura
- **🔒 Type-safe**: Garantia de consistência em tempo de compilação

## 🚀 Como Expandir

### Adicionar Nova Categoria
1. Adicione em `PhotoSessionCategory` enum
2. Adicione pacotes correspondentes em `PHOTO_PACKAGES`

### Adicionar Novo Campo
1. Atualize o tipo `PhotoPackage`
2. Atualize `CreatePhotoPackageDto` se necessário
3. Adicione dados nos pacotes existentes (opcional)

### Criar Nova Função Utilitária
Adicione em `PhotoPackages.ts` e exporte no index. 