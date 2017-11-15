FROM node:8.1.4

RUN mkdir -p /usr/bar
WORKDIR /usr/bar


COPY * /usr/bar/

RUN yarn install


HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD http_proxy= curl -k --silent --fail https://localhost:3000/health

EXPOSE 3000
CMD [ "yarn", "start" ]
