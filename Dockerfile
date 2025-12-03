# Use Node.js 18 as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy backend code to the working directory
COPY backend/ ./

# Copy frontend static files to the working directory
COPY public/ ./public/

# Expose port
EXPOSE 5000

# 设置生产环境变量
ENV NODE_ENV=production
ENV FRONTEND_PATH=/app/public/my-site
ENV PORT=5000

# 启动服务器（使用部署专用版本）
CMD ["node", "backend/src/server.js"]