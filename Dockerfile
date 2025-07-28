FROM node:22-alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
