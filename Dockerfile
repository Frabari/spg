FROM node:16
WORKDIR /app

COPY . .

RUN npm i

EXPOSE 3001
EXPOSE 3000
CMD npm run -w backend seed:run && npm run start