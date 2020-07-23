FROM nginx:1.16-alpine

RUN apk add --update \
    curl \
    && rm -rf /var/cache/apk/*

COPY ./nginx-conf/default.conf /etc/nginx/conf.d/
COPY ../dist/estime /usr/share/nginx/html
