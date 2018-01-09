FROM node:9-alpine AS build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY site-frontend /usr/src/app

RUN npm i && npm run build

FROM abiosoft/caddy:0.10.10

WORKDIR /srv

COPY --from=build /usr/src/app/dist /srv
