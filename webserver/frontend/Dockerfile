FROM node:20-alpine

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install

COPY server.js ./

EXPOSE 4000

CMD ["node", "server.js"]
