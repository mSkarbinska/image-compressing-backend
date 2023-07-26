FROM node:18-alpine

WORKDIR /app-service

COPY package.json .

RUN npm install

RUN npm install -g ts-node

RUN npm install -g nodemon

COPY . .

CMD ["npm", "run", "dev"]