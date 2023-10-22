FROM node:18.16

ARG ARG_BACKEND_EXPOSED_PORT
WORKDIR /usr/src/AppPresenze
COPY package*.json ./ 
RUN npm install
COPY . .
EXPOSE ${ARG_BACKEND_EXPOSED_PORT}
CMD node ./index.js
