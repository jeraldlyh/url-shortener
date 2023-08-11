FROM node:18-alpine As development

WORKDIR /usr/src/app/backend

COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node

FROM node:18-alpine As build

WORKDIR /usr/src/app/backend

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/backend/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build
ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force
USER node

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/backend/.*env .
COPY --chown=node:node --from=build /usr/src/app/backend/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/backend/dist ./dist

CMD [ "node", "dist/main.js" ]
