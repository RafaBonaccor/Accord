FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
COPY .env.local.example ./.env.local

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
