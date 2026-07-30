# Multi-Stage Dockerfile for Arvind Fabric Quality Inspection Tracker

# Stage 1: Build Frontend React / Vite App
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Production Server Environment
FROM node:18-alpine AS runner
WORKDIR /app

# Copy server dependencies and source
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install

COPY server/ ./

# Copy built static frontend assets from stage 1 into client/dist
COPY --from=client-builder /app/client/dist /app/client/dist

# Expose port
EXPOSE 3001

# Environment variables
ENV PORT=3001
ENV NODE_ENV=production

# Execute manual Sequelize CLI migrations & seeders on container launch, then start Express server
CMD ["sh", "-c", "npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && node src/index.js"]
