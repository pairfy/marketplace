FROM node:lts


WORKDIR /app


COPY package*.json ./

RUN ls

RUN npm install


COPY . .


RUN npm run build


EXPOSE 4000

# Run the built JavaScript code
CMD ["npm", "start"]
