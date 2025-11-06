FROM node:20-alpine

WORKDIR /app

RUN npm install -g @expo/cli@latest

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 19006

CMD ["npx", "expo", "start", "--web", "--port", "19006", "--host", "tunnel"]