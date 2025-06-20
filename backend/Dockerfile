# 1. Imagem base
FROM node:18-alpine AS development

# 2. Define o diretório de trabalho
WORKDIR /usr/src/app

# 3. Copia o package.json e package-lock.json
COPY package*.json ./

# 4. Instala as dependências
RUN npm install

# 5. Copia o código da aplicação
COPY . .

# 6. Gera o cliente Prisma
RUN npx prisma generate

# 7. Expõe a porta que a aplicação vai rodar
EXPOSE 3244

# 8. Comando para iniciar a aplicação em modo de desenvolvimento
CMD ["npm", "run", "start:dev"]

# --- Estágio de Produção ---
FROM node:18-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY . .
COPY --from=development /usr/src/app/dist ./dist

# Gera o cliente Prisma para produção
RUN npx prisma generate

EXPOSE 3244

CMD ["node", "dist/main"] 