# Use the official Node.js image as the base image
FROM node:18.16.1-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Nest.js application
RUN npm run build

# Expose the PORT environment variable (default to 4000 if not provided)
ARG PORT=4000
ENV PORT=$PORT
EXPOSE $PORT

# Start the Nest.js application using the start:prod script
CMD ["npm", "run", "start:prod"]
