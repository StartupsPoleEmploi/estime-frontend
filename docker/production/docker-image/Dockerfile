FROM nginx:1.18

RUN apt-get update \
  && apt-get -y install --no-install-recommends \
      fail2ban \
      perl \
      tzdata \
  && rm -rf /var/lib/apt/lists/*

#conf fail2ban
RUN mkdir /var/run/fail2ban
COPY ./docker/commun/fail2ban/jail.conf /etc/fail2ban/
COPY ./docker/commun/fail2ban/filter.d/*.conf /etc/fail2ban/filter.d/

#copy conf NGINX
COPY ./docker/commun/nginx-conf/nginx.conf /etc/nginx/
COPY ./docker/production/docker-image/nginx-conf/default.conf /etc/nginx/conf.d/

#copy application sources
COPY ./dist/estime /usr/share/nginx/html

#add useful scripts
COPY ./docker/commun/scripts/startup.sh .
RUN chmod +x startup.sh

## add permissions for nginx user
RUN chown nginx:nginx startup.sh \
 && chown -R nginx:nginx /usr/share/nginx \
 && chown -R nginx:nginx /var/cache/nginx \
 && chown -R nginx:nginx /var/log/nginx \
 && chown -R nginx:nginx /etc/nginx/conf.d \
 && mkdir -p /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp \
 && touch  /tmp/nginx.pid \
 && chown -R nginx:nginx /tmp  \
 && chown -R nginx:nginx /var/run/fail2ban

#use non root user nginx
USER nginx

ENTRYPOINT ./startup.sh