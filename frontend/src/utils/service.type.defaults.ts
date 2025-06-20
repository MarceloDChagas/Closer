interface Package {
  nome: string;
  valor: string;
  qtdFotos: string;
}

interface ServiceTypeDefault {
  type: string;
  pacotes: Package[];
}

const serviceTypeDefaults: ServiceTypeDefault[] = [
  {
    "type": "ACOMPANHAMENTO",
    "pacotes": [
      { "nome": "Padrão", "valor": "800.00", "qtdFotos": "50" },
      { "nome": "Mensal Básico", "valor": "90.00", "qtdFotos": "3" },
      { "nome": "Mensal Detalhado", "valor": "150.00", "qtdFotos": "6" },
      { "nome": "Premium Anual", "valor": "2200.00", "qtdFotos": "110" },
      { "nome": "Anual 3 fotos/mês", "valor": "900.00", "qtdFotos": "33" },
      { "nome": "Anual 6 fotos/mês", "valor": "1500.00", "qtdFotos": "66" }
    ]
  },
  {
    "type": "ANIVERSARIO",
    "pacotes": [
      { "nome": "Padrão", "valor": "800.00", "qtdFotos": "60" },
      { "nome": "Smash + Aniversário (50 fotos)", "valor": "600.00", "qtdFotos": "50" },
      { "nome": "Smash + Aniversário (ilimitado)", "valor": "1500.00", "qtdFotos": "ILIMITADAS" }
    ]
  },
  {
    "type": "BOOK",
    "pacotes": [
      { "nome": "Pacote 1 - Estúdio", "valor": "300.00", "qtdFotos": "10" },
      { "nome": "Pacote 3 - Estúdio ou Externo", "valor": "1000.00", "qtdFotos": "ILIMITADAS" }
    ]
  },
  {
    "type": "CASAL",
    "pacotes": [
      { "nome": "Pacote 1 - Estúdio", "valor": "300.00", "qtdFotos": "10" },
      { "nome": "Pacote 3 - Externo", "valor": "400.00", "qtdFotos": "20" },
      { "nome": "Pacote 4 - Externo", "valor": "1000.00", "qtdFotos": "ILIMITADAS" }
    ]
  },
  {
    "type": "CASAMENTO",
    "pacotes": [
      { "nome": "Pacote 1", "valor": "500.00", "qtdFotos": "30" },
      { "nome": "Pacote 2", "valor": "2000.00", "qtdFotos": "100" },
      { "nome": "Pacote 3", "valor": "3000.00", "qtdFotos": "ILIMITADAS" },
      { "nome": "Pacote Diamante", "valor": "4000.00", "qtdFotos": "ILIMITADAS" }
    ]
  },
  {
    "type": "DIA_DAS_MAES",
    "pacotes": [
      { "nome": "Pacote 1", "valor": "150.00", "qtdFotos": "6" },
      { "nome": "Pacote 2", "valor": "200.00", "qtdFotos": "10" },
      { "nome": "Pacote Premium", "valor": "1000.00", "qtdFotos": "ILIMITADAS" }
    ]
  },
  {
    "type": "ENSAIO_FAMILIA",
    "pacotes": [
      { "nome": "Pacote 1 - Estúdio (fundo branco ou boho)", "valor": "300.00", "qtdFotos": "10" },
      { "nome": "Pacote 2 - Externo", "valor": "400.00", "qtdFotos": "20" },
      { "nome": "Pacote 3 - Externo", "valor": "1000.00", "qtdFotos": "ILIMITADAS" }
    ]
  },
  {
    "type": "ENSAIO_FEMININO",
    "pacotes": [
      { "nome": "Pacote 1 - Estúdio", "valor": "300.00", "qtdFotos": "10" },
      { "nome": "Pacote 3 - Estúdio ou Externo", "valor": "1000.00", "qtdFotos": "ILIMITADAS" }
    ]
  },
  {
    "type": "ENSAIO_GESTANTE",
    "pacotes": [
      { "nome": "Pacote 1 - Fundo liso ou Boho (10 fotos)", "valor": "300.00", "qtdFotos": "10" },
      { "nome": "Pacote 2 - Fundo liso ou Boho (20 fotos)", "valor": "500.00", "qtdFotos": "20" },
      { "nome": "Pacote 3 - Fundo liso ou Boho + Álbum", "valor": "1000.00", "qtdFotos": "30" },
      { "nome": "Pacote Combinado Fundo liso + Boho (20 fotos)", "valor": "600.00", "qtdFotos": "20" },
      { "nome": "Pacote Combinado Fundo liso + Boho + Álbum (40 fotos)", "valor": "1200.00", "qtdFotos": "40" },
      { "nome": "Pacote Externo (20 fotos)", "valor": "600.00", "qtdFotos": "20" },
      { "nome": "Pacote Externo - Ilimitado", "valor": "1000.00", "qtdFotos": "ILIMITADAS" },
      { "nome": "Pacote Externo - Ilimitado + Álbum", "valor": "1500.00", "qtdFotos": "ILIMITADAS" },
      { "nome": "Acompanhamento Gestacional (3 ensaios + álbum)", "valor": "1000.00", "qtdFotos": "30" }
    ]
  },
  {
    "type": "ENSAIO_INFANTIL",
    "pacotes": [
      { "nome": "Pacote 1 - Estúdio", "valor": "300.00", "qtdFotos": "10" },
      { "nome": "Pacote 2 - Estúdio ou Externo", "valor": "400.00", "qtdFotos": "20" },
      { "nome": "Pacote 3 - Estúdio ou Externo", "valor": "1000.00", "qtdFotos": "ILIMITADAS" }
    ]
  },
  {
    "type": "EVENTO",
    "pacotes": [
      { "nome": "StoryMaker - Casamento (4h)", "valor": "600.00", "qtdFotos": "0" },
      { "nome": "StoryMaker - Casamento (6h + making of)", "valor": "800.00", "qtdFotos": "0" },
      { "nome": "StoryMaker - Aniversário (2h)", "valor": "300.00", "qtdFotos": "0" },
      { "nome": "StoryMaker - Aniversário (4h)", "valor": "400.00", "qtdFotos": "0" }
    ]
  },
  {
    "type": "FORMATURA",
    "pacotes": [
      { "nome": "Pacote 1 (2 famílias)", "valor": "300.00", "qtdFotos": "10" },
      { "nome": "Pacote 1 (3 famílias)", "valor": "200.00", "qtdFotos": "10" },
      { "nome": "Pacote 2 (2 famílias)", "valor": "400.00", "qtdFotos": "20" },
      { "nome": "Pacote 2 (3 famílias)", "valor": "300.00", "qtdFotos": "20" },
      { "nome": "Pacote 3 (2 famílias)", "valor": "1100.00", "qtdFotos": "ILIMITADAS" },
      { "nome": "Pacote 3 (3 famílias)", "valor": "1000.00", "qtdFotos": "ILIMITADAS" }
    ]
  },
  {
    "type": "INSTITUCIONAL",
    "pacotes": [
      { "nome": "Pacote 1 - Estúdio (2 looks)", "valor": "300.00", "qtdFotos": "10" },
      { "nome": "Pacote 2 - Estúdio ou Trabalho", "valor": "400.00", "qtdFotos": "20" },
      { "nome": "Pacote 3 - Estúdio e Trabalho", "valor": "500.00", "qtdFotos": "30" }
    ]
  },
  {
    "type": "MEMORIAS_POLAROID",
    "pacotes": [
      { "nome": "Álbum + 40 fotos", "valor": "750.00", "qtdFotos": "40" },
      { "nome": "Álbum + 50 fotos", "valor": "800.00", "qtdFotos": "50" },
      { "nome": "Caixa + 80 fotos", "valor": "1200.00", "qtdFotos": "80" },
      { "nome": "Caixa + 100 fotos + desconto no Storymaker", "valor": "1300.00", "qtdFotos": "100" }
    ]
  },
  {
    "type": "PARTO",
    "pacotes": [
      { "nome": "Pacote 1 - Cesárea", "valor": "500.00", "qtdFotos": "ILIMITADAS" },
      { "nome": "Pacote 2 - Cesárea + 10 fotos gestante", "valor": "700.00", "qtdFotos": "ILIMITADAS" },
      { "nome": "Pacote 3 - Cesárea + 10 fotos newborn", "valor": "800.00", "qtdFotos": "ILIMITADAS" },
      { "nome": "Pacote 4 - Cesárea + 10 fotos gestante + 10 fotos newborn", "valor": "1100.00", "qtdFotos": "ILIMITADAS" }
    ]
  },
  {
    "type": "SMASH_THE_CAKE",
    "pacotes": [
      { "nome": "Pacote 1", "valor": "300.00", "qtdFotos": "10" },
      { "nome": "Pacote 2", "valor": "400.00", "qtdFotos": "20" },
      { "nome": "Pacote 3", "valor": "700.00", "qtdFotos": "ILIMITADAS" }
    ]
  }
]

export default serviceTypeDefaults;