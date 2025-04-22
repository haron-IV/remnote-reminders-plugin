FROM node:22-alpine
ENV PNPM_HOME="/pnpm"
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install
RUN pnpm --filter @remnote-reminders-plugin/shared run build
WORKDIR /app/server
RUN pnpm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]