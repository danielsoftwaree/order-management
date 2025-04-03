FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

RUN npm install -g pnpm --verbose

WORKDIR /app/apps/api
RUN pnpm install

WORKDIR /app
COPY . .

WORKDIR /app/apps/api

# Создаем скрипт для запуска
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'echo "Waiting for database connection..."' >> /entrypoint.sh && \
    echo 'pnpm prisma:deploy' >> /entrypoint.sh && \
    echo 'pnpm build' >> /entrypoint.sh && \
    echo 'pnpm start:prod' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

EXPOSE 3000

CMD ["/entrypoint.sh"] 