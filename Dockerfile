FROM reform/yarn:8

WORKDIR /usr/bar/src/app

COPY package.json ./
# COPY .yarnrc ./
COPY yarn.lock ./

RUN yarn
COPY . .

HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD http_proxy= curl -k --silent --fail https://localhost:3000/health

EXPOSE 3000
CMD [ "yarn", "start" ]
