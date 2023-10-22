# build stage
FROM node:18-alpine as build-stage

# Take API url as an image build argument and set it as an environment variable
# to be read by the 'npm run build' command

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install
ARG BACK_HOSTNAME
ARG BACK_PORT
ENV VITE_API_HOST=${BACK_HOSTNAME}
ENV VITE_API_PORT=${BACK_PORT}
# Build the app sources with minification
COPY . .
RUN npm run build

# production stage
FROM nginx:1.25.2-alpine

# Copy build output from build-stage image
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Serve application on port 80 of the container
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
