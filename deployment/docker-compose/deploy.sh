#connect to private container registry
echo "$3" | docker login -u $2 --password-stdin $1

#pull images used in docker-compose
docker-compose pull

#retart or up docker services with docker-compose
container_name=estime-frontend
if sudo docker container ls -a --format '{{.Names}}' | grep -Eq "^${container_name}\$"; then
  docker-compose restart
else
  docker-compose up -d --remove-orphans
fi

#clean docker environment
docker image prune --force
docker container prune --force
docker volume prune --force

#logout docker registry
docker logout $1
