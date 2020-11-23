FROM nginx:1.16-alpine

RUN apk --no-cache update && \
    apk --no-cache upgrade && \
    apk --no-cache add \
    curl \
    tzdata \
    && rm -rf /var/cache/apk/*

COPY ./nginx-conf/default.conf /etc/nginx/conf.d/
COPY ../../dist/estime /usr/share/nginx/html

COPY startup.sh .
RUN chmod +x ./startup.sh

ENTRYPOINT ./startup.sh