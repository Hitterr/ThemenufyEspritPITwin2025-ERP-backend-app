FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm i -g pnpm
RUN pnpm i

# Copy source code including models directory
COPY ./src ./src

# Expose the port that the app will run on
EXPOSE 5000

# Start the application
CMD ["pnpm", "start"]