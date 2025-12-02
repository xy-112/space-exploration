# Use Node.js 18 as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend code to the working directory
COPY backend/ ./

# Copy frontend static files to the working directory
COPY public/ ./public/

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
