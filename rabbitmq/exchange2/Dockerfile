FROM node:12.17.0-alpine3.9

WORKDIR usr/src/rabbitmq-exchange

COPY src/dist/ ./dist
COPY src/package.json .

RUN npm install

COPY rabbitmq/exchange2/broker-config.json ./dist/

ENTRYPOINT node dist/src/slave-broker.js