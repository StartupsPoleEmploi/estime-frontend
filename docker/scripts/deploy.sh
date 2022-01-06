#connect to private container registry
echo "$3" | docker login -u $2 --password-stdin $1

#deploy a new stack or update an existing stack
docker stack deploy --with-registry-auth -c estime-frontend-stack.yml estime-frontend

#clean docker environment
docker image prune --force
docker container prune --force

#logout docker registry
docker logout $1
