FROM node:latest

# Set the working directory
WORKDIR /server

# Install the latest version of ShareX-Server from NPM
RUN npm install sharex-server

# Copy the JS file to the container
COPY "./run.js" "./run.js"

# Expose port 80 outside of the container
EXPOSE 80

# Set the default ENV parameters
ENV PASSWORD password
ENV UPLOADS_PATH /uploads
ENV LENGTH 10

CMD ["node", "run.js"]