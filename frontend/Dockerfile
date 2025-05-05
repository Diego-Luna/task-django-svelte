# Etapa de construcción
FROM node:18-alpine as build

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY svelte.config.js ./
COPY vite.config.ts ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir para producción si es necesario
ARG ENVIRONMENT=development
RUN if [ "$ENVIRONMENT" = "production" ] ; then npm run build ; fi

# Etapa de desarrollo
FROM node:18-alpine as development
WORKDIR /app
COPY --from=build /app .
EXPOSE 5000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Etapa de producción
FROM nginx:alpine as production
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# FROM node:iron

# WORKDIR /app

# # Install dependencies
# COPY package.json .
# RUN npm install

# # Copy app files
# COPY . .

# # Start development server
# EXPOSE 5000
# CMD ["npm", "run", "dev"]