# Use Node.js for building React
FROM node:22.14.0 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire app and build it
COPY . .
ARG REACT_APP_BACKEND_URL=https://carboncube-ke.com/api
ARG REACT_APP_SITE_URL=https://carboncube-ke.com
ARG REACT_APP_WEBSOCKET_URL=wss://carboncube-ke.com/cable
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
ENV REACT_APP_SITE_URL=${REACT_APP_SITE_URL}
ENV REACT_APP_WEBSOCKET_URL=${REACT_APP_WEBSOCKET_URL}
ENV API_URL=${REACT_APP_BACKEND_URL}
ENV SITE_URL=${REACT_APP_SITE_URL}
ENV SKIP_POSTBUILD=true

# Build without postbuild (react-snap) to avoid Puppeteer/Chrome issues
RUN npm run build

# Use Nginx as the web server
FROM nginx:alpine

# Copy built React app to Nginx HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
