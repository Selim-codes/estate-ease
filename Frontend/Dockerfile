# Stage 1: Build the frontend
FROM node:18 AS build

WORKDIR /src

# ✅ Install dependencies
COPY package.json ./
RUN npm install

# ✅ Copy all source files
COPY . .

# ✅ Build Vite frontend (output goes to /src/dist)
RUN npm run build

# Stage 2: Serve the frontend with nginx
FROM nginx:alpine

# ✅ Copy build output to Nginx HTML directory
COPY --from=build /src/dist/ /usr/share/nginx/html

# ✅ Use custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ✅ Expose port 80
EXPOSE 80

# ✅ Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
