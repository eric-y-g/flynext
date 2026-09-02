# SETUP NODE
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Prisma setup
RUN npx prisma generate
# RUN npx prisma migrate deploy

# Build the app
RUN npm run build
# Expose the port
EXPOSE 3000

# Start the app
CMD sh -c "npx prisma migrate deploy && npm run start"