FROM node:18-alpine3.18

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma

# COPY .env ./

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "start:prod" ]