#!/bin/bash

function replace_env_properties {
	log 'replace tokens env properties in main.js'
  perl -i -p -e "s|%%pe-connect.client-id%%|${PEAMA_URL}|g" usr/share/nginx/html/main*.js

  perl -i -p -e '
	  $PE_CONNECT_CLIENT_ID=qw('$PE_CONNECT_CLIENT_ID');
	  $PE_CONNECT_REDIRECT_URI=qw('$PE_CONNECT_REDIRECT_URI');
    $PE_CONNECT_SCOPE=qw('$PE_CONNECT_SCOPE');
    $PE_CONNECT_IDENTITY_SERVER_URL=qw('$PE_CONNECT_IDENTITY_SERVER_URL');
	  s|%%pe-connect.client-id%%|$PE_CONNECT_CLIENT_ID|g;
	  s|%%pe-connect.redirect-uri%%|$PE_CONNECT_REDIRECT_URI|g;
    s|%%pe-connect.scope%%|$PE_CONNECT_SCOPE|g;
	  s|%%pe-connect.identity-server-url%%|$PE_CONNECT_IDENTITY_SERVER_URL|g' usr/share/nginx/html/main*.js
}

function replace_tagCommander_url {
	log 'replace tagcommander script url in index.html'
	perl -i -p -e "s|'%%tagcommander.script.url%%'|${TAG_COMMANDER_SCRIPT_URL}|g" usr/share/nginx/html/index.html
}

start_nginx() {
	log 'start nginx'
	nginx -g "daemon off;"
}

function start {
  replace_env_properties &&
	replace_tagCommander_url
	start_nginx
}

function log {
	echo "<EVT TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S,000')" TYPE="INFO"><![CDATA[INFO startup.sh : $1]]></EVT>"
}

start
