# Venestlus — zero-dependency Node.js PWA
FROM node:22-alpine

WORKDIR /app

# Verify the app inside the image that will actually run it
COPY package.json ./
COPY server.js ./
COPY src ./src
COPY public ./public
COPY tests ./tests
RUN npm test

ENV NODE_ENV=production \
    PORT=3000 \
    DATA_DIR=/data

RUN mkdir -p /data && chown -R node:node /data /app
USER node

VOLUME ["/data"]
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1

CMD ["node", "server.js"]
