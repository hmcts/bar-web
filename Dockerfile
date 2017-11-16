FROM node:8.1.4

WORKDIR /usr/bar/src/app


COPY package*.json ./

RUN yarn install
COPY . .

HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD http_proxy= curl -k --silent --fail https://localhost:3000/health

EXPOSE 3000
CMD [ "yarn", "start" ]
