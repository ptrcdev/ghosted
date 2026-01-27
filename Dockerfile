FROM node:22-slim AS deps
WORKDIR /app
ENV NODE_ENV=development

COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci --include=dev

FROM node:22-slim AS build
WORKDIR /app
ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build -w @job-tracker/shared
RUN npm run build -w @job-tracker/backend

FROM node:22-slim AS run
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/apps/backend/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY apps/backend/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/src/main.js"]
