FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN ls

RUN npm install --verbose

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "npm start"]

