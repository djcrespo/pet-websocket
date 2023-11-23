# Usa la imagen oficial de Node.js para ARM
FROM arm32v7/node:14

# Crea y establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos necesarios
COPY package*.json ./
COPY server.js ./

# Instala las dependencias
RUN npm install

# Expone el puerto si tu aplicación usa uno
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["nodemon", "server"]