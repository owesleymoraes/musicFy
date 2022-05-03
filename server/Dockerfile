FROM node:17-slim

RUN apt-get update \
&& apt-get install sox libsox-fmt-mp3

# libsox-fmt-all caso fosse para todos os tipos de arquivos de som.

WORKDIR /spotify-radio/

COPY package.json package.lock.json /spotify-radio/

RUN npm ci --silent

COPY . . 

USER node

CMD npm run live-reload