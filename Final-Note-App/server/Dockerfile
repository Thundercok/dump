FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache bash

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY . .
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Build the TypeScript code
RUN npm run build
RUN mkdir -p uploads

ENV DB_HOST=mysql \
    DB_PORT=3306 \
    DB_USER=root \
    DB_PASSWORD=root \
    DB_NAME=noteapp

EXPOSE 5500

CMD ["/wait-for-it.sh", "mysql:3306", "--", "npm", "start"]
