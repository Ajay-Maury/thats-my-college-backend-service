# Use a slimmer Node.js base image with essential packages for production
FROM node:18.16.1-slim

# Install global Node.js packages for NestJS development
# RUN npm i -g @nestjs/cli typescript ts-node

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json for efficient dependency installation
COPY package*.json ./

# Install only production dependencies
# RUN npm install --production

# Install only dependencies
RUN npm ci

# Copy the remaining application code
COPY . .

# Build the Nest.js application
RUN npm run build

# Set the default port to 4000 if not overridden
ARG PORT=4000
ENV PORT=$PORT
EXPOSE $PORT

# Switch to a non-root user for security
USER node

# Start the application using the production script
CMD ["npm", "run", "start:prod"]
