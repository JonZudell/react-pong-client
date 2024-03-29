# Use a base image with Node.js pre-installed
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Needed for run CMD
RUN npm install -g serve

# Copy the local directory to the working directory
COPY . .

# Install dependencies
RUN npm install

# Build the project
RUN npm run build

# Set the start command with port 3001
CMD ["serve", "-s", "build", "-l", "3001"]