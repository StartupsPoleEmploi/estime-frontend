FROM nginx:1.16-alpine

ENV APP_DIR "/app"

RUN apk --no-cache update && \
    apk --no-cache upgrade && \
    apk --no-cache add \
    curl \
    tzdata \
    && rm -rf /var/cache/apk/*

COPY ./nginx-conf/default.conf /etc/nginx/conf.d/
COPY ../../dist/estime /usr/share/nginx/html

COPY scripts ${APP_DIR}
RUN chmod +x ${APP_DIR}/*.sh

# ENTRYPOINT ${APP_DIR}/startup.sh
