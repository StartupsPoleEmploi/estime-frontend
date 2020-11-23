FROM nginx:1.16

COPY ./nginx-conf/default.conf /etc/nginx/conf.d/
COPY ../../dist/estime /usr/share/nginx/html

COPY startup.sh .
RUN chmod +x startup.sh

ENTRYPOINT ./startup.sh
