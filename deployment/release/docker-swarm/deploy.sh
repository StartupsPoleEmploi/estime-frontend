#connect to private container registry
echo "$3" | docker login -u $2 --password-stdin $1

container_name=estime-frontend
# if new version is passed and container exists, update estime-frontend image
if [ ! -z "$4" ] && [sudo docker container ls -a --format '{{.Names}}' | grep -Eq "^${container_name}\$"]; then
  docker service update --image registry.beta.pole-emploi.fr/estime/estime-frontend:$4 estime-frontend
else
  docker stack deploy --with-registry-auth -c estime-frontend-stack.yml estime-frontend
fi

#clean docker environment
docker image prune --force
docker container prune --force
docker volume prune --force

#logout docker registry
docker logout $1
