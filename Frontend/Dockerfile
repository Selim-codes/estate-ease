# Stage 1: Build the frontend
FROM node:18 AS build

WORKDIR /src

# Install dependencies
COPY package.json ./
RUN npm install

# Copy all frontend source
COPY . .

# Build the frontend
RUN npm run build

# Stage 2: Serve the frontend with nginx
FROM nginx:alpine

# Copy build output to nginx html directory
COPY --from=build /src/dist/ /usr/share/nginx/html

# Optional: Use custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
