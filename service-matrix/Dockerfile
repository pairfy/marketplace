FROM node:lts


WORKDIR /app


COPY package*.json ./

RUN ls

RUN npm install


COPY . .


RUN npm run build


EXPOSE 8000


CMD ["npm", "start"]
