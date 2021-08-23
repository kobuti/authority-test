docker-compose -f ../docker/docker-compose.yaml down &&
fuser -k 8081/tcp &&
fuser -k 8082/tcp