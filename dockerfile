# Use the official Node.js image.
FROM node:22

# Set the working directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code.
COPY . .

# Build the NestJS application.
RUN npm run build

# Expose the application port.
EXPOSE 3000

# Command to run the application.
CMD ["npm", "run", "start:dev"]