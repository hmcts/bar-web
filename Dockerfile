FROM hmctspublic.azurecr.io/base/node:12-alpine

COPY . .

RUN yarn install --production && yarn cache clean
