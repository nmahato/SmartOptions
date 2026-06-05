# Stage 1: Build the Angular application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application from a lightweight Nginx server
FROM nginx:1.25-alpine

# Copy the built application from the 'build' stage to Nginx's web root
COPY --from=build /app/dist/smartoptions-angular/browser /usr/share/nginx/html

EXPOSE 4200
