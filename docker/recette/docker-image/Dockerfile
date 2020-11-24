FROM nginx:1.16-alpine

RUN apk --no-cache update && \
    apk --no-cache upgrade && \
    apk --no-cache add \
    bash  \
    perl \
    tzdata \
    && rm -rf /var/cache/apk/*

#copy conf NGINX
COPY ./docker/commun/nginx-conf/nginx.conf /etc/nginx/
COPY ./docker/recette/docker-image/nginx-conf/default.conf /etc/nginx/conf.d/

#copy application sources
COPY ./dist/estime /usr/share/nginx/html

#add useful scripts
COPY ./docker/commun/scripts/startup.sh .
RUN chmod +x startup.sh

## add permissions for nginx user
RUN chown nginx:nginx startup.sh && \
    chown -R nginx:nginx /usr/share/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

RUN mkdir -p var/run && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

#use non root user nginx
USER nginx

ENTRYPOINT ./startup.sh