FROM node:20-alpine AS build

# Define build arguments for environment variables
ARG VITE_API_URL

# Set environment variables during the build process
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

COPY . .

RUN npm install -g pnpm --verbose

WORKDIR /app/apps/web
RUN pnpm install
RUN pnpm build

FROM nginx:alpine

COPY --from=build /app/apps/web/dist /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 