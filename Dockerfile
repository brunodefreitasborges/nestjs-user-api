# Use the Node.js latest base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the entire app directory to the working directory
COPY . .

# Generate the Prisma client files
RUN npx prisma generate

# Build the NestJS app
RUN npm run build

# Copy the templates directory to the dist directory
COPY templates dist/templates

# Expose the port your NestJS app is listening on (e.g., 3000)
EXPOSE 3000

# Start the NestJS app
CMD [ "node", "dist/main" ]