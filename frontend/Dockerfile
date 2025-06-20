# --- Estágio de Build ---
FROM node:18-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e o package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Define a variável de ambiente para a URL da API
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Executa o build da aplicação
RUN npm run build

# --- Estágio de Produção ---
FROM node:18-alpine

WORKDIR /app

# Copia as dependências de produção
COPY package*.json ./
RUN npm install --only=production

# Copia os arquivos de build do estágio anterior
COPY --from=build /app/dist ./dist

# Expõe a porta
EXPOSE 3007

# Comando para servir os arquivos estáticos (usando 'serve')
# Instala o 'serve' globalmente
RUN npm install -g serve

# Inicia o servidor para servir a pasta 'dist'
CMD ["serve", "-s", "dist", "-l", "3007"] 