#!/bin/bash

function replace_properties_in_main {
  log 'replace properties in main.js'
  perl -i -p -e "s|pe-connect.client-id|${PE_CONNECT_CLIENT_ID}|g" /var/www/estime/main*.js
  perl -i -p -e "s|pe-connect.redirect-uri|${PE_CONNECT_REDIRECT_URI}|g" /var/www/estime/main*.js
  perl -i -p -e "s|pe-connect.scope|${PE_CONNECT_SCOPE}|g" /var/www/estime/main*.js
  perl -i -p -e "s|pe-connect.identity-server-url|${PE_CONNECT_IDENTITY_SERVER_URL}|g" /var/www/estime/main*.js
}

function replace_properties_in_index {
	log 'replace properties in index.html'
	perl -i -p -e "s|tagcommander.script.url|${TAG_COMMANDER_SCRIPT_URL}|g" /var/www/estime/index.html
}

function start_nginx {
	log 'start nginx'
	nginx -g "daemon off;"
}

function start_fail2ban {
  log 'start fail2ban'
  fail2ban-client -x start
}

function start {
  replace_properties_in_main &&
  replace_properties_in_index &&
  start_fail2ban &&
  start_nginx
}

function log {
	echo "<EVT TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S,000')" TYPE="INFO"><![CDATA[INFO startup.sh : $1]]></EVT>"
}

start