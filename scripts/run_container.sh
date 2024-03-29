#!/bin/bash

# Stop and remove any existing container
docker stop react-pong-client
docker rm react-pong-client

# Run the container
docker run -d --name react-pong-client -p 3001:3001 react-pong-client