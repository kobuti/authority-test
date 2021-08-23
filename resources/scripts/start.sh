docker-compose -f ../docker/docker-compose.yaml up -d

npm start --prefix ../../registration-server > /dev/null 2>&1 &
npm start --prefix ../../registration-ui > /dev/null 2>&1 &