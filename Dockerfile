
FROM node:18-alpine AS builder

WORKDIR /app

COPY tsconfig*.json ./
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps 
COPY . .
COPY .env ./.env

RUN npm run build

FROM node:18-alpine AS production

USER node
WORKDIR /app

COPY --from=builder --chown=node:node /app/cert ./cert
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/.env ./.env

ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production

CMD ["node", "dist/main.js"]