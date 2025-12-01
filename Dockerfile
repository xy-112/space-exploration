# 使用Node.js 18作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json到工作目录
COPY backend/package*.json ./

# 安装依赖
RUN npm install

# 复制后端代码到工作目录
COPY backend/ ./

# 复制前端静态文件到工作目录
COPY public/ ./public/

# 暴露端口
EXPOSE 5000

# 启动服务器
CMD ["npm", "start"]