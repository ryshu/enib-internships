FROM node:10

COPY package.json ./services

RUN npm install --only=production

COPY services/dist ./

EXPOSE 8090

CMD ["node", "server.js"]