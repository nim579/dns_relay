FROM node:fermium-alpine

WORKDIR /app

EXPOSE 53535/udp
EXPOSE 53535/tcp

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

ENTRYPOINT ['npm', 'start']
