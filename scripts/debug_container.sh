#!/bin/bash

docker stop react-pong-client
docker rm react-pong-client

docker run -it --name react-pong-client -p 3001:3001 react-pong-client /bin/bash