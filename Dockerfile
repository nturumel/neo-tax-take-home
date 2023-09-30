FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json .
COPY prisma ./prisma/
# for seeding the database
RUN npm install -g ts-node
RUN npm install --no-progress
EXPOSE 8080