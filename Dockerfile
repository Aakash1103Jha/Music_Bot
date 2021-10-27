# specify a base image
FROM node:alpine

# specifies the path of the directory where files from 
# local fs should be copied by the COPY command
WORKDIR /projects/docker-nodejs

# first copy only package.json
COPY ./package.json ./

# install dependencies
RUN npm install

# then copy all other files -> sourse code
COPY ./ ./

# specify startup command
CMD ["npm", "run", "bot"]
