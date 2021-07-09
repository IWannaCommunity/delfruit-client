### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:12.18.4-alpine3.12 as builder

COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build

RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder

RUN npm cache clean --force

ARG CAPTCHA_KEY="default"
ARG API_URL="/api"

RUN apk --no-cache add sd --repository=http://dl-cdn.alpinelinux.org/alpine/edge/testing
RUN sd "\{\{\{CAPTCHA_KEY\}\}\}" $CAPTCHA_KEY ./src/environments/environment.prod.ts
RUN sd "\{\{\{API_URL\}\}\}" $API_URL ./src/environments/environment.prod.ts

RUN npm run ng build -- --prod --output-path=dist


### STAGE 2: Setup ###

FROM alpine:3.11.11

COPY --from=builder /ng-app/dist /app/