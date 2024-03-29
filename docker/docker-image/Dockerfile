FROM nginx:1.20

RUN apt-get update \
  && apt-get -y install --no-install-recommends \
      perl \
      tzdata \
      vim \
  && rm -rf /var/lib/apt/lists/*

#copy application sources
RUN mkdir -p /var/www/estime
COPY ./dist/estime /var/www/estime

#add useful scripts
COPY ./docker/docker-image/scripts/startup.sh .
RUN chmod +x startup.sh

#modify NGINX configuration to pass nginx user
RUN sed -i '/user  nginx;/d' /etc/nginx/nginx.conf \
    && sed -i 's,/var/run/nginx.pid,/tmp/nginx.pid,' /etc/nginx/nginx.conf

## modify permissions for nginx user
RUN chown nginx:nginx startup.sh \
 && chown -R nginx:nginx /usr/share/nginx \
 && chown -R nginx:nginx /var/cache/nginx \
 && chown -R nginx:nginx /var/log/nginx \
 && chown -R nginx:nginx /etc/nginx/conf.d \
 && mkdir -p /etc/nginx/includes \
 && chown -R nginx:nginx /etc/nginx/includes \
 && mkdir -p /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp \
 && touch  /tmp/nginx.pid \
 && chown -R nginx:nginx /tmp \
 && chown -R nginx:nginx /var/www/estime

USER nginx

ENTRYPOINT ./startup.sh
