FROM node:16

WORKDIR /
RUN git clone https://github.com/wolfcw/libfaketime.git
WORKDIR /libfaketime/src
RUN make install

WORKDIR /app

COPY . .

RUN npm i
RUN npm run -w backend seed:run

EXPOSE 3001
EXPOSE 3000
