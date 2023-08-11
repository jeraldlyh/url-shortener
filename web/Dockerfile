FROM node:18-alpine

WORKDIR /usr/src/app/web

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]