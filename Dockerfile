FROM zzrot/alpine-caddy
COPY Caddyfile /etc/Caddyfile
COPY site-frontend /var/www/html
WORKDIR /var/www/html
RUN apk add --no-cache --virtual build-dependencies make gcc g++ python nodejs-npm
RUN npm i && npm run build
