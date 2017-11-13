FROM node:8.1.4

RUN mkdir -p /usr/src/app
WORKDIR /usr/src

COPY package.json yarn.lock /usr/src

COPY src /usr/src
COPY config /usr/src/config

RUN yarn install
RUN yarn build

HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD http_proxy= curl -k --silent --fail https://localhost:3000/health

EXPOSE 3000
CMD [ "yarn", "start" ]
