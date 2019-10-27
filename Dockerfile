FROM node:10

# Set Work directory
WORKDIR /opt/enib/internships-manager

# Set env var
ENV PROJECT_MONITORING_API_PORT=8090
ENV ORM_DROP_DB_ON_START=false
ENV ORM_LOGGING=false

# Copy and run npm package in production mode
COPY services/package.json ./
RUN npm install --only=production

# Copy service and webapp
COPY app/dist ./public/
COPY services/dist ./

EXPOSE 8090

CMD ["node", "server.js"]
