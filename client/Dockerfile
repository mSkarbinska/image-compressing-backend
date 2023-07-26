FROM node:18-alpine

WORKDIR /client

COPY package.json .

RUN npm i
RUN npm i react-query

COPY . .

EXPOSE 5005

CMD ["npm", "run", "dev"]