# Use Node.js official image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose port 8000
EXPOSE 8000

# Start the application
CMD ["npm", "run", "dev"]
