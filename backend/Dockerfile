# Use the official Node.js image.
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install --production

# Copy local code to the container image.
COPY . .

# Set environment variables from build arguments
ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD
ARG DB_NAME
ARG PORT
ARG ACCESS_TOKEN_SECRET

ENV DB_HOST=$DB_HOST
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_NAME=$DB_NAME
ENV PORT=$PORT
ENV ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET

# Run the web service on container startup.
CMD [ "npm", "start" ]
.env
