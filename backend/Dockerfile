# Usando uma imagem base do Node.js
FROM node:20

# Definindo o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiando o arquivo de dependências para o container
COPY package*.json ./

# Instalando as dependências
RUN npm install


# Copiando o restante do código para o container
COPY . .

# Expondo a porta na qual a aplicação será executada
EXPOSE 3033

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]
