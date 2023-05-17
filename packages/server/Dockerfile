FROM node:18.15.0

# Create app directory
RUN mkdir -p /usr/src/app

# Set working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN yarn install

# copy source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start app
CMD [ "yarn", "start" ]

# Use official MongoDB image
FROM mongo:4.4.6

# Create a directory for MongoDB data
RUN mkdir -p /data/db

# Expose port 27017
EXPOSE 27017

# Start MongoDB
CMD [ "mongod", "--bind_ip_all" ]
