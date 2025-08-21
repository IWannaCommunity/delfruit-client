### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:16.20.1-alpine3.17 as builder

COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build

RUN npm ci && mkdir /nextjs-app && mv ./node_modules ./nextjs-app

WORKDIR /nextjs-app

COPY . .

## Build the nextjs app in production mode and store the artifacts in dist folder

RUN npm cache clean --force

ARG API_URL="/api"

RUN apk --no-cache add sd --repository=http://dl-cdn.alpinelinux.org/alpine/v3.19/community/
RUN sd --string-mode "http://localhost:4201" "$API_URL" ./src/config.json

RUN npm run build
RUN npm run export


### STAGE 2: Setup ###

FROM alpine:3.16.9

COPY --from=builder /nextjs-app/out /app/