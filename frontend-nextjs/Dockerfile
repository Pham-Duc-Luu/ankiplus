# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire Next.js app to the working directory
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port that the application will run on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
