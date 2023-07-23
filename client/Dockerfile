FROM node

WORKDIR /app

COPY package.json .

RUN npm i

COPY . .

EXPOSE 5005

CMD ["npm", "run", "dev"]