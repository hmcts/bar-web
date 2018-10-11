FROM node:8.12.0-slim

RUN mkdir -p /usr/bar/src/app
WORKDIR /usr/bar/src/app

COPY . /usr/bar/src/app/

RUN yarn install
RUN yarn build

RUN pwd
RUN ls -ltr

HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD http_proxy= curl -k --silent --fail https://localhost:3000/health

EXPOSE 3000
CMD [ "yarn", "start" ]
