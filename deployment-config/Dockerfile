FROM node:latest

# Create app directory
WORKDIR /usr/src/app

COPY src/ ./

# Bundle app source
COPY . .

EXPOSE 443

CMD [ "npm", "start" ]