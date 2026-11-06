FROM node:24-bookworm-slim

WORKDIR /app
RUN npm install --global pnpm@12.16.1
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
ARG APP_ORIGIN=http://127.0.0.1
ENV APP_ORIGIN=$APP_ORIGIN
RUN pnpm build && mkdir -p /app/local && chown -R node:node /app

ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
USER node
EXPOSE 3000
CMD ["sh", "scripts/docker-start.sh"]
