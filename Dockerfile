FROM hmctspublic.azurecr.io/base/node:18-alpine

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts . .
RUN yarn workspaces focus --all --production \
  && yarn cache clean
