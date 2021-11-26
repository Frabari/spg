FROM node:16
WORKDIR /app

COPY . .

RUN npm i
RUN npm run -w backend seed:run

EXPOSE 3001
EXPOSE 3000
CMD npm run start
