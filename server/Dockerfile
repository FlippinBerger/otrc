FROM node:22

WORKDIR /app

COPY package.json /app
COPY . /app

EXPOSE 3000

WORKDIR /app

RUN npm i
RUN npm run build

ENV NODE_ENV="production"

CMD ["npm", "start"]
