# Usa Node 20 como especifica el package.json
FROM node:20

WORKDIR /app

# Copia los archivos de configuración
COPY package.json yarn.lock ./

# Instala dependencias usando Yarn
RUN yarn install

# Copia el resto del código fuente
COPY . .

# Construye la aplicación
RUN yarn build

# Expone el puerto 3039 (puerto por defecto de Vite)
EXPOSE 3039

# Inicia el servidor de desarrollo
CMD ["yarn", "dev", "--host"]