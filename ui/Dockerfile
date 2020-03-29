# base image
FROM node:12.2.0-alpine
RUN apk add bash

# set working directory
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn
COPY . .

CMD ["yarn", "start"]
