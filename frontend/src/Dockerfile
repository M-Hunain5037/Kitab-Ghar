# Use an official Node.js image
FROM node:14

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the frontend application
RUN npm run build

# Install a simple server to serve the frontend
RUN npm install -g serve

# Expose the frontend port
EXPOSE 3000

# Start the frontend server
CMD ["serve", "-s", "build"]
